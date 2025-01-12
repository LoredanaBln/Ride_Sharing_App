package main.ride_sharing_app.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentMethod;
import com.stripe.model.PaymentMethodCollection;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentMethodAttachParams;
import main.ride_sharing_app.model.Order;
import main.ride_sharing_app.model.Passenger;
import main.ride_sharing_app.model.payment.StripeCustomer;
import main.ride_sharing_app.repository.StripeCustomerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.util.Optional;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.util.concurrent.TimeUnit;

@Service
public class PaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    private final StripeCustomerRepository stripeCustomerRepository;
    private final Cache<String, Customer> customerCache;
    private final Cache<String, List<PaymentMethod>> paymentMethodsCache;

    public PaymentService(StripeCustomerRepository stripeCustomerRepository) {
        this.stripeCustomerRepository = stripeCustomerRepository;
        this.customerCache = Caffeine.newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .maximumSize(1000)
            .build();
        this.paymentMethodsCache = Caffeine.newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .maximumSize(1000)
            .build();
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public Customer createStripeCustomer(Passenger passenger) throws StripeException {
        CustomerCreateParams params = CustomerCreateParams.builder()
            .setEmail(passenger.getEmail())
            .setName(passenger.getName())
            .build();
        
        Customer stripeCustomer = Customer.create(params);
        
        StripeCustomer customerEntity = new StripeCustomer();
        customerEntity.setPassenger(passenger);
        customerEntity.setStripeCustomerId(stripeCustomer.getId());
        stripeCustomerRepository.save(customerEntity);
        
        return stripeCustomer;
    }

    public PaymentMethod attachPaymentMethod(String paymentMethodId, String customerId) 
            throws StripeException {
        try {
            PaymentMethod paymentMethod = PaymentMethod.retrieve(paymentMethodId);
            
            // Add more flexible validation
            Map<String, Object> params = new HashMap<>();
            params.put("payment_method", paymentMethodId);
            params.put("customer", customerId);
            params.put("confirm", true);
            
            paymentMethod.attach(
                PaymentMethodAttachParams.builder()
                    .setCustomer(customerId)
                    .build()
            );
            
            // Set as default if it's the first card
            Customer customer = Customer.retrieve(customerId);
            if (customer.getInvoiceSettings().getDefaultPaymentMethod() == null) {
                Map<String, Object> updateParams = new HashMap<>();
                updateParams.put("invoice_settings", 
                    Map.of("default_payment_method", paymentMethodId));
                customer.update(updateParams);
                
                StripeCustomer stripeCustomer = stripeCustomerRepository
                    .findByStripeCustomerId(customerId)
                    .orElseThrow(() -> new RuntimeException("Stripe customer not found"));
                stripeCustomer.setDefaultPaymentMethodId(paymentMethodId);
                stripeCustomerRepository.save(stripeCustomer);
            }
            
            return paymentMethod;
        } catch (StripeException e) {
            System.err.println("Stripe error: " + e.getMessage());
            throw e;
        }
    }

    public PaymentIntent createPaymentIntent(Order order) throws StripeException {
        StripeCustomer stripeCustomer = stripeCustomerRepository
            .findByPassenger(order.getPassenger())
            .orElseThrow(() -> new RuntimeException("Stripe customer not found"));

        if (stripeCustomer.getDefaultPaymentMethodId() == null) {
            throw new RuntimeException("No payment method found for customer");
        }

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount((long) (order.getPrice() * 100)) // Stripe uses cents
            .setCurrency("usd")
            .setCustomer(stripeCustomer.getStripeCustomerId())
            .setPaymentMethod(stripeCustomer.getDefaultPaymentMethodId())
            .setCaptureMethod(PaymentIntentCreateParams.CaptureMethod.MANUAL) // Don't capture until driver accepts
            .setConfirm(true) // Confirm immediately to authorize the payment
            .addPaymentMethodType("card")
            .setAutomaticPaymentMethods(
                PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                    .setEnabled(false)
                    .build()
            )
            .setReturnUrl("http://localhost:5173/payment/complete") // Required even if not using redirects
            .build();

        PaymentIntent intent = PaymentIntent.create(params);
        order.setPaymentIntentId(intent.getId());
        return intent;
    }

    public void confirmPayment(Order order) throws StripeException {
        PaymentIntent intent = PaymentIntent.retrieve(order.getPaymentIntentId());

        // Capture the already confirmed payment
        intent.capture();
    }

    public String getOrCreateStripeCustomer(Passenger passenger) throws StripeException {
        // Try to find existing customer
        Optional<StripeCustomer> existingCustomer = stripeCustomerRepository.findByPassenger(passenger);
        
        if (existingCustomer.isPresent()) {
            return existingCustomer.get().getStripeCustomerId();
        }

        // If no customer exists, create new one
        Customer stripeCustomer = createStripeCustomer(passenger);
        return stripeCustomer.getId();
    }

    public List<Map<String, String>> getPaymentMethods(String customerId) throws StripeException {
        Customer customer;
        List<PaymentMethod> methods;
        
        try {
            customer = customerCache.get(customerId, key -> {
                try {
                    return Customer.retrieve(key);
                } catch (StripeException e) {
                    throw new RuntimeException(e);
                }
            });

            // Get all payment methods directly from Stripe instead of using cache for now
            Map<String, Object> params = new HashMap<>();
            params.put("customer", customerId);
            params.put("type", "card");
            PaymentMethodCollection methodCollection = PaymentMethod.list(params);
            methods = methodCollection.getData();

            String defaultMethodId = customer.getInvoiceSettings().getDefaultPaymentMethod();

            return methods.stream()
                .map(method -> {
                    Map<String, String> methodData = new HashMap<>();
                    methodData.put("id", method.getId());
                    methodData.put("type", method.getCard().getBrand().toUpperCase());
                    methodData.put("lastFourDigits", method.getCard().getLast4());
                    methodData.put("expiryDate", 
                        method.getCard().getExpMonth() + "/" + method.getCard().getExpYear());
                    if (method.getCard().getIssuer() != null) {
                        methodData.put("issuer", method.getCard().getIssuer());
                    }
                    boolean isDefault = defaultMethodId != null && 
                                      defaultMethodId.equals(method.getId());
                    methodData.put("isDefault", Boolean.toString(isDefault));
                    return methodData;
                })
                .collect(Collectors.toList());
        } catch (RuntimeException e) {
            if (e.getCause() instanceof StripeException) {
                throw (StripeException) e.getCause();
            }
            throw e;
        }
    }

    public void deletePaymentMethod(String paymentMethodId) throws StripeException {
        PaymentMethod paymentMethod = PaymentMethod.retrieve(paymentMethodId);
        
        // Check if this is the default payment method
        Customer customer = Customer.retrieve(paymentMethod.getCustomer());
        String defaultPaymentMethodId = customer.getInvoiceSettings().getDefaultPaymentMethod();
        
        if (paymentMethodId.equals(defaultPaymentMethodId)) {
            // If this is the default payment method, find another one to set as default
            Map<String, Object> params = new HashMap<>();
            params.put("customer", customer.getId());
            params.put("type", "card");
            PaymentMethodCollection methods = PaymentMethod.list(params);
            
            List<PaymentMethod> otherMethods = methods.getData().stream()
                .filter(m -> !m.getId().equals(paymentMethodId))
                .collect(Collectors.toList());
                
            if (!otherMethods.isEmpty()) {
                // Set another card as default before deleting this one
                Map<String, Object> updateParams = new HashMap<>();
                updateParams.put("invoice_settings", 
                    Map.of("default_payment_method", otherMethods.get(0).getId()));
                customer.update(updateParams);
                
                // Update in our database
                StripeCustomer stripeCustomer = stripeCustomerRepository
                    .findByStripeCustomerId(customer.getId())
                    .orElseThrow(() -> new RuntimeException("Stripe customer not found"));
                stripeCustomer.setDefaultPaymentMethodId(otherMethods.get(0).getId());
                stripeCustomerRepository.save(stripeCustomer);
            }
        }
        
        // Now we can safely detach the payment method
        paymentMethod.detach();
        
        // Clear caches
        customerCache.invalidate(paymentMethod.getCustomer());
        paymentMethodsCache.invalidate(paymentMethod.getCustomer());
    }

    public void setDefaultPaymentMethod(String paymentMethodId, String customerId) throws StripeException {
        Customer customer;
        try {
            customer = customerCache.get(customerId, key -> {
                try {
                    return Customer.retrieve(key);
                } catch (StripeException e) {
                    throw new RuntimeException(e);
                }
            });
        } catch (RuntimeException e) {
            if (e.getCause() instanceof StripeException) {
                throw (StripeException) e.getCause();
            }
            throw e;
        }

        Map<String, Object> params = new HashMap<>();
        params.put("invoice_settings", 
            Map.of("default_payment_method", paymentMethodId));
        customer.update(params);

        // Invalidate cache
        customerCache.invalidate(customerId);
        paymentMethodsCache.invalidate(customerId);

        // Update database
        StripeCustomer stripeCustomer = stripeCustomerRepository
            .findByStripeCustomerId(customerId)
            .orElseThrow(() -> new RuntimeException("Stripe customer not found"));
        stripeCustomer.setDefaultPaymentMethodId(paymentMethodId);
        stripeCustomerRepository.save(stripeCustomer);
    }
} 