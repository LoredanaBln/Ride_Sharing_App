package main.ride_sharing_app.model.payment;

import jakarta.persistence.*;
import lombok.Data;
import main.ride_sharing_app.model.Driver;

@Entity
@Table(name = "stripe_connect_accounts",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "driver_driver_id"),
           @UniqueConstraint(columnNames = "stripe_connect_id")
       })
@Data
public class StripeConnectAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "driver_driver_id", unique = true, nullable = false)
    private Driver driver;

    @Column(name = "stripe_connect_id", unique = true, nullable = false)
    private String stripeConnectId;

    private String defaultBankAccountId;
} 