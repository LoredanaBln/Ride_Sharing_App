package main.ride_sharing_app.websocket.message;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class LocationUpdateMessage extends WebSocketMessage {
    private Long driverId;
    private Long orderId;
    private Double latitude;
    private Double longitude;
    
    public LocationUpdateMessage(Long driverId, Long orderId, Double latitude, Double longitude) {
        super("LOCATION_UPDATE");
        this.driverId = driverId;
        this.orderId = orderId;
        this.latitude = latitude;
        this.longitude = longitude;
    }
} 