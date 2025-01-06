package main.ride_sharing_app.websocket.message;

import lombok.Data;

@Data
public abstract class WebSocketMessage {
    private final String type;

    protected WebSocketMessage(String type) {
        this.type = type;
    }
} 