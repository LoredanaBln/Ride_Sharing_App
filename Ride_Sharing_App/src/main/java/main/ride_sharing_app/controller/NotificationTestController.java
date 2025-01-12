package main.ride_sharing_app.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import main.ride_sharing_app.websocket.listener.WebSocketEventListener;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/test/notification")
@Slf4j
@RequiredArgsConstructor
public class NotificationTestController {

    private final WebSocketEventListener webSocketEventListener;

    @PostMapping("/send")
    public ResponseEntity<String> sendTestNotification(@RequestParam String driverEmail) {
        try {
            log.info("Attempting to send test notification to driver: {}", driverEmail);
            webSocketEventListener.sendTestNotification(driverEmail);
            return ResponseEntity.ok("Test notification sent successfully");
        } catch (Exception e) {
            log.error("Error sending test notification: ", e);
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
} 