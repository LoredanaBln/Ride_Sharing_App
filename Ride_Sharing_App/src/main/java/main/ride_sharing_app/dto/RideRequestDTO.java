package main.ride_sharing_app.dto;

import lombok.Data;

@Data
public class RideRequestDTO {
    private Long passengerId;
    private String pickupLocation;
    private String destinationLocation;
    private Double pickupLatitude;
    private Double pickupLongitude;
    private Double destinationLatitude;
    private Double destinationLongitude;
} 