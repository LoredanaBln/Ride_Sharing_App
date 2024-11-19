package model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderId;

//    @ManyToOne
//    @JoinColumn(name = "driver_id")
//    private Driver driver;

//    @ManyToOne
//    @JoinColumn(name = "passenger_id", referencedColumnName = "id")
//    private Passenger passenger;

    private String startLocation;

    private String endLocation;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private Double price;
    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;

    private LocalDateTime startTime;

    private LocalDateTime endTime;
}
