package main.ride_sharing_app.websocket.message;

import lombok.Data;
import lombok.EqualsAndHashCode;
import main.ride_sharing_app.model.OrderStatus;
import main.ride_sharing_app.websocket.dto.OrderNotificationDTO;

@Data
@EqualsAndHashCode(callSuper = true)
public class OrderNotificationMessage extends WebSocketMessage {
    private Long orderId;
    private OrderStatus status;
    private String message;
    
    public OrderNotificationMessage(Long orderId, OrderStatus status, String message) {
        super("ORDER_NOTIFICATION");
        this.orderId = orderId;
        this.status = status;
        this.message = message;
    }

    public OrderNotificationDTO toDTO() {
        return new OrderNotificationDTO(
            this.orderId,
            this.status.toString(),
            this.message,
            System.currentTimeMillis()
        );
    }
} 