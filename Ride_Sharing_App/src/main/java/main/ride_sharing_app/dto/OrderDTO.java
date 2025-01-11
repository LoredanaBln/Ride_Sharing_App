package main.ride_sharing_app.dto;

import lombok.Data;
import main.ride_sharing_app.model.payment.PaymentType;

@Data
public class OrderDTO {
    private Long passengerId;
    private String startLocation;
    private String endLocation;
    private Double startLatitude;
    private Double startLongitude;
    private Double endLatitude;
    private Double endLongitude;
    private PaymentType paymentType;
    private Double estimatedPrice;
} 