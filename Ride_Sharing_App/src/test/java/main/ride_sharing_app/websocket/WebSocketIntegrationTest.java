package main.ride_sharing_app.websocket;

import main.ride_sharing_app.model.OrderStatus;
import main.ride_sharing_app.websocket.message.ChatMessage;
import main.ride_sharing_app.websocket.message.LocationUpdateMessage;
import main.ride_sharing_app.websocket.message.OrderNotificationMessage;
import main.ride_sharing_app.model.UserType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import java.lang.reflect.Type;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class WebSocketIntegrationTest {

    @LocalServerPort
    private int port;

    private WebSocketStompClient stompClient;
    private CompletableFuture<OrderNotificationMessage> orderCompletable;
    private CompletableFuture<LocationUpdateMessage> locationCompletable;
    private CompletableFuture<ChatMessage> chatCompletable;

    @BeforeEach
    void setup() {
        this.stompClient = new WebSocketStompClient(new SockJsClient(
            List.of(new WebSocketTransport(new StandardWebSocketClient()))
        ));
        stompClient.setMessageConverter(new MappingJackson2MessageConverter());
        
        orderCompletable = new CompletableFuture<>();
        locationCompletable = new CompletableFuture<>();
        chatCompletable = new CompletableFuture<>();
    }

    @Test
    void testOrderNotification() throws Exception {
        StompSession session = stompClient
            .connect(String.format("ws://localhost:%d/ws", port), new TestStompSessionHandler())
            .get(1, TimeUnit.SECONDS);

        session.subscribe("/topic/orders/1/status", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return OrderNotificationMessage.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                orderCompletable.complete((OrderNotificationMessage) payload);
            }
        });

        OrderNotificationMessage message = new OrderNotificationMessage(1L, OrderStatus.ACCEPTED, "Test message");
        session.send("/app/order.notification", message);

        OrderNotificationMessage received = orderCompletable.get(3, TimeUnit.SECONDS);
        assertNotNull(received);
        assertEquals(OrderStatus.ACCEPTED, received.getStatus());
        assertEquals("Test message", received.getMessage());
    }

    @Test
    void testLocationUpdate() throws Exception {
        StompSession session = stompClient
            .connect(String.format("ws://localhost:%d/ws", port), new TestStompSessionHandler())
            .get(1, TimeUnit.SECONDS);

        session.subscribe("/topic/orders/1/location", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return LocationUpdateMessage.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                locationCompletable.complete((LocationUpdateMessage) payload);
            }
        });

        LocationUpdateMessage message = new LocationUpdateMessage(1L, 1L, 44.4268, 26.1025);
        session.send("/app/location.update", message);

        LocationUpdateMessage received = locationCompletable.get(3, TimeUnit.SECONDS);
        assertNotNull(received);
        assertEquals(44.4268, received.getLatitude());
        assertEquals(26.1025, received.getLongitude());
    }

    @Test
    void testChat() throws Exception {
        StompSession session = stompClient
            .connect(String.format("ws://localhost:%d/ws", port), new TestStompSessionHandler())
            .get(1, TimeUnit.SECONDS);

        session.subscribe("/topic/orders/1/chat", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return ChatMessage.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                chatCompletable.complete((ChatMessage) payload);
            }
        });

        ChatMessage message = new ChatMessage(1L, "driver1", UserType.DRIVER, "Hello!");
        session.send("/app/chat.send", message);

        ChatMessage received = chatCompletable.get(3, TimeUnit.SECONDS);
        assertNotNull(received);
        assertEquals("Hello!", received.getContent());
        assertEquals(UserType.DRIVER, received.getSenderType());
    }
} 