package main.ride_sharing_app.model;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class GeoLocation {
    private Double latitude;
    private Double longitude;
} 