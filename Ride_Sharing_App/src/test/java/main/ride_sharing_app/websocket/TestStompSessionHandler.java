package main.ride_sharing_app.websocket;

import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;

public class TestStompSessionHandler extends StompSessionHandlerAdapter {
    @Override
    public void handleException(StompSession session, StompCommand command, 
                              StompHeaders headers, byte[] payload, Throwable exception) {
        throw new RuntimeException("Failed to connect to STOMP server", exception);
    }

    @Override
    public void handleTransportError(StompSession session, Throwable exception) {
        throw new RuntimeException("Transport error", exception);
    }
} 