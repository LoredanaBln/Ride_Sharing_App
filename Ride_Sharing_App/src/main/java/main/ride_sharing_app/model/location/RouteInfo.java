package main.ride_sharing_app.model.location;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class RouteInfo {
    private Double distanceInMeters;
    private Double durationInSeconds;
    private String geometry;
    
    public Double getDistanceInKm() {
        return distanceInMeters / 1000;
    }
    
    public Integer getDurationInMinutes() {
        return (int) (durationInSeconds / 60);
    }
} 