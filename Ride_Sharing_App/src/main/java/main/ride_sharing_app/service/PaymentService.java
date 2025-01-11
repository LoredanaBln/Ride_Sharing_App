package main.ride_sharing_app.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentMethod;
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

@Service
public class PaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    private final StripeCustomerRepository stripeCustomerRepository;

    public PaymentService(StripeCustomerRepository stripeCustomerRepository) {
        this.stripeCustomerRepository = stripeCustomerRepository;
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
        PaymentMethod paymentMethod = PaymentMethod.retrieve(paymentMethodId);
        paymentMethod.attach(
            PaymentMethodAttachParams.builder()
                .setCustomer(customerId)
                .build()
        );
        
        StripeCustomer stripeCustomer = stripeCustomerRepository
            .findByStripeCustomerId(customerId)
            .orElseThrow(() -> new RuntimeException("Stripe customer not found"));
        stripeCustomer.setDefaultPaymentMethodId(paymentMethodId);
        stripeCustomerRepository.save(stripeCustomer);
        
        return paymentMethod;
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
} 