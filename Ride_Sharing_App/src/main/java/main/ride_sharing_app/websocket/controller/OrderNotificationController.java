package main.ride_sharing_app.websocket.controller;

import main.ride_sharing_app.model.Order;
import main.ride_sharing_app.websocket.dto.OrderNotificationDTO;
import main.ride_sharing_app.websocket.message.OrderNotificationMessage;
import main.ride_sharing_app.websocket.dto.DriverInfoDTO;
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

    public void notifyPassenger(Long passengerId, OrderNotificationDTO notification) {
        messagingTemplate.convertAndSend(
            "/topic/passengers/" + passengerId + "/orders",
            notification
        );
    }

    public void sendDriverAcceptanceNotification(Order order) {
        OrderNotificationDTO notification = OrderNotificationDTO.builder()
            .orderId(order.getId())
            .status(order.getStatus().toString())
            .message("Driver " + order.getDriver().getName() + " has accepted your ride")
            .timestamp(System.currentTimeMillis())
            .driverInfo(new DriverInfoDTO(
                order.getDriver().getName(),
                order.getDriver().getPhoneNumber(),
                order.getDriver().getCarType(),
                order.getDriver().getCarColor(),
                order.getDriver().getRating()
            ))
            .estimatedArrival(order.getEstimatedDurationMinutes())
            .build();

        notifyPassenger(order.getPassenger().getId(), notification);
    }
} 