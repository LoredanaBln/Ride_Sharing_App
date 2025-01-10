package main.ride_sharing_app.model.payment;

import jakarta.persistence.*;
import lombok.Data;
import main.ride_sharing_app.model.Passenger;

@Entity
@Data
public class StripeCustomer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Passenger passenger;

    @Column(nullable = false)
    private String stripeCustomerId;

    private String defaultPaymentMethodId;
} 