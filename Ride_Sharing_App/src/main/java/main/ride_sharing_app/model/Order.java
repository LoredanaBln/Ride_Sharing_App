package main.ride_sharing_app.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table(name = "orders")
@Entity
@Data
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinColumn(name = "driver_id", referencedColumnName = "driver_id")
    private Driver driver;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinColumn(name = "passenger_id", referencedColumnName = "passenger_id")
    private Passenger passenger;

    @Column(name = "start_location")
    private String startLocation;

    @Column(name = "end_location")
    private String endLocation;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Column(name = "price")
    private Double price;

    @Column(name = "payment_type")
    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    public Order(Driver driver, Passenger passenger, String startLocation, String endLocation, OrderStatus status, Double price, PaymentType paymentType, LocalDateTime startTime, LocalDateTime endTime) {
        this.driver = driver;
        this.passenger = passenger;
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.status = status;
        this.price = price;
        this.paymentType = paymentType;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
