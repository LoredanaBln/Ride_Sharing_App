package main.ride_sharing_app.model;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class RouteInfo {
    private Double distanceInMeters;
    private Double durationInSeconds;
    
    public Double getDistanceInKm() {
        return distanceInMeters / 1000;
    }
    
    public Integer getDurationInMinutes() {
        return (int) (durationInSeconds / 60);
    }
} 