package main.ride_sharing_app.websocket.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderNotificationDTO {
    private Long orderId;
    private String status;  // String representation of OrderStatus enum
    private String message;
    private Long timestamp;
} 