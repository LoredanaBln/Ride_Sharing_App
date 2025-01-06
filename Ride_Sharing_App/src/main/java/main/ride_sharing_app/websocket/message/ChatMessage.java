package main.ride_sharing_app.websocket.message;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ChatMessage extends WebSocketMessage {
    private Long orderId;
    private String senderId;
    private SenderType senderType;
    private String content;

    public enum SenderType {
        DRIVER,
        PASSENGER
    }

    public ChatMessage(Long orderId, String senderId, SenderType senderType, String content) {
        super("CHAT_MESSAGE");
        this.orderId = orderId;
        this.senderId = senderId;
        this.senderType = senderType;
        this.content = content;
    }
} 