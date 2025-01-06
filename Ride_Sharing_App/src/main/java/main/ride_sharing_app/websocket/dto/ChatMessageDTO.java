package main.ride_sharing_app.websocket.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDTO {
    private Long orderId;
    private String senderId;
    private String senderType;  // "DRIVER" or "PASSENGER"
    private String content;
    private Long timestamp;
} 