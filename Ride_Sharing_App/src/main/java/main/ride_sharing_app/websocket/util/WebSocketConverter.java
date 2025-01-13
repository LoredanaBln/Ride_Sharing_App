package main.ride_sharing_app.websocket.util;

import main.ride_sharing_app.websocket.dto.ChatMessageDTO;
import main.ride_sharing_app.websocket.dto.LocationUpdateDTO;
import main.ride_sharing_app.websocket.dto.OrderNotificationDTO;
import main.ride_sharing_app.websocket.message.ChatMessage;
import main.ride_sharing_app.websocket.message.LocationUpdateMessage;
import main.ride_sharing_app.websocket.message.OrderNotificationMessage;
import main.ride_sharing_app.model.OrderStatus;

public class WebSocketConverter {

    // Order Notification conversions
    public static OrderNotificationDTO toDTO(OrderNotificationMessage message) {
        return OrderNotificationDTO.builder()
            .orderId(message.getOrderId())
            .status(message.getStatus().toString())
            .message(message.getMessage())
            .timestamp(System.currentTimeMillis())
            .build();
    }

    public static OrderNotificationMessage toMessage(OrderNotificationDTO dto) {
        return new OrderNotificationMessage(
            dto.getOrderId(),
            OrderStatus.valueOf(dto.getStatus()),
            dto.getMessage()
        );
    }

    // Location Update conversions
    public static LocationUpdateDTO toDTO(LocationUpdateMessage message) {
        return new LocationUpdateDTO(
            message.getDriverId(),
            message.getOrderId(),
            message.getLatitude(),
            message.getLongitude(),
            System.currentTimeMillis()
        );
    }

    public static LocationUpdateMessage toMessage(LocationUpdateDTO dto) {
        return new LocationUpdateMessage(
            dto.getDriverId(),
            dto.getOrderId(),
            dto.getLatitude(),
            dto.getLongitude()
        );
    }

    // Chat Message conversions
    public static ChatMessageDTO toDTO(ChatMessage message) {
        return new ChatMessageDTO(
            message.getOrderId(),
            message.getSenderId(),
            message.getSenderType().toString(),
            message.getContent(),
            System.currentTimeMillis()
        );
    }

    public static ChatMessage toMessage(ChatMessageDTO dto) {
        return new ChatMessage(
            dto.getOrderId(),
            dto.getSenderId(),
            ChatMessage.SenderType.valueOf(dto.getSenderType()),
            dto.getContent()
        );
    }
} 