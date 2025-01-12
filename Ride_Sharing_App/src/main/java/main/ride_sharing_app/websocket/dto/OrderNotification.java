package main.ride_sharing_app.websocket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderNotification {
    private Long orderId;
    private String startLocation;
    private String endLocation;
    private Double estimatedPrice;
    private Double distance;
    private Long timestamp;
    private String status;
    private String message;
} 