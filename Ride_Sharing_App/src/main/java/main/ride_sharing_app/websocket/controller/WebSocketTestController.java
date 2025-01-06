package main.ride_sharing_app.websocket.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketTestController {

    @MessageMapping("/websocket.test.message")
    @SendTo("/topic/test")
    public String handleTestMessage(String message) {
        return "Server received: " + message;
    }
} 