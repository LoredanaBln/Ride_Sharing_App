package main.ride_sharing_app.controller;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Customer;
import com.stripe.model.PaymentMethod;
import main.ride_sharing_app.model.Order;
import main.ride_sharing_app.model.Passenger;
import main.ride_sharing_app.service.OrderService;
import main.ride_sharing_app.service.PaymentService;
import main.ride_sharing_app.service.PassengerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;
    private final PassengerService passengerService;

    public PaymentController(PaymentService paymentService, OrderService orderService, PassengerService passengerService) {
        this.paymentService = paymentService;
        this.orderService = orderService;
        this.passengerService = passengerService;
    }

    @PostMapping("/createPaymentIntent/{orderId}")
    public ResponseEntity<PaymentIntent> createPaymentIntent(@PathVariable Long orderId) {
        try {
            Order order = orderService.getOrderById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
            PaymentIntent paymentIntent = paymentService.createPaymentIntent(order);
            return ResponseEntity.ok(paymentIntent);
        } catch (StripeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload, 
                                                    @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            // Handle webhook event
            // Verify signature and process payment status
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/setupCustomer/{passengerId}")
    public ResponseEntity<String> setupCustomer(@PathVariable Long passengerId) {
        try {
            Passenger passenger = passengerService.getPassengerById(passengerId);
            Customer customer = paymentService.createStripeCustomer(passenger);
            return ResponseEntity.ok(customer.getId());
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/attachPaymentMethod")
    public ResponseEntity<String> attachPaymentMethod(
        @RequestParam String paymentMethodId,
        @RequestParam String customerId
    ) {
        try {
            PaymentMethod method = paymentService.attachPaymentMethod(paymentMethodId, customerId);
            return ResponseEntity.ok(method.getId());
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 