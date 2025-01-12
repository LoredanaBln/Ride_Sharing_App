package main.ride_sharing_app.websocket.listener;

import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.stereotype.Component;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.context.event.EventListener;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import main.ride_sharing_app.websocket.dto.OrderNotification;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleSessionConnected(SessionConnectedEvent event) {
        StompHeaderAccessor headers = StompHeaderAccessor.wrap(event.getMessage());
        log.info("New WebSocket session connected: {}", headers.getSessionId());
    }

    @EventListener
    public void handleSessionSubscribe(SessionSubscribeEvent event) {
        StompHeaderAccessor headers = StompHeaderAccessor.wrap(event.getMessage());
        log.info("New subscription on destination: {} for session: {}", 
            headers.getDestination(), headers.getSessionId());
    }

    public void sendTestNotification(String driverEmail) {
        try {
            OrderNotification testNotification = new OrderNotification(
                1L,
                "Test Start Location",
                "Test End Location",
                25.0,
                5.0,
                System.currentTimeMillis(),
                "NEW",
                "Test order request"
            );

            String destination = "/topic/drivers/" + driverEmail + "/orders";
            log.info("Sending test notification to {}", destination);
            messagingTemplate.convertAndSend(destination, testNotification);
            log.info("Test notification sent successfully");
        } catch (Exception e) {
            log.error("Error sending test notification: ", e);
        }
    }
} 