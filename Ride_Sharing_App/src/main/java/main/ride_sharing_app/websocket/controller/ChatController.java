package main.ride_sharing_app.websocket.controller;

import main.ride_sharing_app.websocket.dto.ChatMessageDTO;
import main.ride_sharing_app.websocket.util.WebSocketConverter;
import main.ride_sharing_app.websocket.message.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.handler.annotation.DestinationVariable;

@Controller
public class ChatController {

    @MessageMapping("/chat.message/{orderId}")
    @SendTo("/topic/chat/{orderId}")
    public ChatMessageDTO handleChatMessage(
        @DestinationVariable Long orderId,
        ChatMessageDTO dto
    ) {
        System.out.println("Received chat message: " + dto);
        ChatMessage message = WebSocketConverter.toMessage(dto);
        return WebSocketConverter.toDTO(message);
    }
} 