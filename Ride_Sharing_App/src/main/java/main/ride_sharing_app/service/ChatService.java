package main.ride_sharing_app.service;

import main.ride_sharing_app.websocket.dto.ChatMessageDTO;
import main.ride_sharing_app.websocket.controller.ChatController;
import org.springframework.stereotype.Service;

@Service
public class ChatService {
    private final ChatController chatController;

    public ChatService(ChatController chatController) {
        this.chatController = chatController;
    }

    public void sendMessage(Long orderId, String senderId, String senderType, String content) {
        ChatMessageDTO message = new ChatMessageDTO(
            orderId,
            senderId,
            senderType,
            content,
            System.currentTimeMillis()
        );
        chatController.handleChatMessage(orderId, message);
    }
} 