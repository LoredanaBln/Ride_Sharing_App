package main.ride_sharing_app.websocket.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationUpdateDTO {
    private Long driverId;
    private Long orderId;
    private Double latitude;
    private Double longitude;
    private Long timestamp;
} 