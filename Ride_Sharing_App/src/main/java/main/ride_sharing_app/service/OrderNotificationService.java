package main.ride_sharing_app.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import main.ride_sharing_app.model.Order;
import main.ride_sharing_app.websocket.dto.OrderNotification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderNotificationService {
    
    private final SimpMessagingTemplate messagingTemplate;

    public void sendOrderNotification(Order order) {
        try {
            if (order.getDriver() == null) {
                log.error("Cannot send notification for order {} - no driver assigned", order.getId());
                return;
            }

            OrderNotification notification = new OrderNotification(
                order.getId(),
                order.getStartLocation(),
                order.getEndLocation(),
                order.getPrice(),
                order.getEstimatedDistanceKm(),
                System.currentTimeMillis(),
                order.getStatus().toString(),
                "New ride request"
            );

            String destination = "/topic/drivers/" + order.getDriver().getEmail() + "/orders";
            log.info("Sending order notification to {}", destination);
            messagingTemplate.convertAndSend(destination, notification);
            log.info("Order notification sent successfully");
        } catch (Exception e) {
            log.error("Error sending order notification: ", e);
        }
    }
} 