package main.ride_sharing_app.websocket.controller;

import main.ride_sharing_app.model.Order;
import main.ride_sharing_app.model.Passenger;
import main.ride_sharing_app.service.PassengerService;
import main.ride_sharing_app.websocket.dto.OrderNotificationDTO;
import main.ride_sharing_app.websocket.message.OrderNotificationMessage;
import main.ride_sharing_app.websocket.dto.DriverInfoDTO;
import main.ride_sharing_app.websocket.util.WebSocketConverter;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class OrderNotificationController {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final PassengerService passengerService;

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
        String passengerEmail = getPassengerEmail(passengerId);
        String destination = "/topic/passengers/" + passengerEmail + "/orders";
        System.out.println("Sending notification to: " + destination);
        System.out.println("Notification content: " + notification);
        
        messagingTemplate.convertAndSend(destination, notification);
    }

    private String getPassengerEmail(Long passengerId) {
        Passenger passenger = passengerService.getPassengerById(passengerId);
        return passenger.getEmail();
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

    public void sendRideCompletedNotification(Order order) {
        System.out.println("Creating COMPLETED notification for order: " + order.getId());
        
        OrderNotificationDTO notification = OrderNotificationDTO.builder()
            .orderId(order.getId())
            .status("COMPLETED")
            .message("Your ride has been completed")
            .timestamp(System.currentTimeMillis())
            .driverInfo(new DriverInfoDTO(
                order.getDriver().getName(),
                order.getDriver().getPhoneNumber(),
                order.getDriver().getCarType(),
                order.getDriver().getCarColor(),
                order.getDriver().getRating()
            ))
            .build();

        System.out.println("Sending COMPLETED notification: " + notification);
        notifyPassenger(order.getPassenger().getId(), notification);
    }

    public void sendRideCanceledNotification(Order order, String reason) {
        System.out.println("Creating CANCELED notification for order: " + order.getId());
        
        OrderNotificationDTO notification = OrderNotificationDTO.builder()
            .orderId(order.getId())
            .status("CANCELED")
            .message("Your ride has been canceled" + (reason != null ? ": " + reason : ""))
            .timestamp(System.currentTimeMillis())
            .driverInfo(order.getDriver() != null ? new DriverInfoDTO(
                order.getDriver().getName(),
                order.getDriver().getPhoneNumber(),
                order.getDriver().getCarType(),
                order.getDriver().getCarColor(),
                order.getDriver().getRating()
            ) : null)
            .build();

        System.out.println("Sending CANCELED notification: " + notification);
        notifyPassenger(order.getPassenger().getId(), notification);
    }
} 