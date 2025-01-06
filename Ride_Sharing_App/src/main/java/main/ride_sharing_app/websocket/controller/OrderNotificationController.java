package main.ride_sharing_app.websocket.controller;

import main.ride_sharing_app.websocket.dto.OrderNotificationDTO;
import main.ride_sharing_app.websocket.message.OrderNotificationMessage;
import main.ride_sharing_app.websocket.util.WebSocketConverter;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.util.List;

@Controller
public class OrderNotificationController {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    public OrderNotificationController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/order.notification/{orderId}")
    @SendTo("/topic/orders/{orderId}/status")
    public OrderNotificationDTO handleOrderNotification(
        @DestinationVariable Long orderId,
        OrderNotificationDTO dto
    ) {
        System.out.println("Received order notification: " + dto);
        OrderNotificationMessage message = WebSocketConverter.toMessage(dto);
        return WebSocketConverter.toDTO(message);
    }

    // Method to notify nearby drivers about new orders
    public void notifyNearbyDrivers(OrderNotificationDTO notification, List<Long> driverIds) {
        for (Long driverId : driverIds) {
            messagingTemplate.convertAndSend(
                "/topic/drivers/" + driverId + "/orders",
                notification
            );
        }
    }
} 