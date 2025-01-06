package main.ride_sharing_app.websocket.controller;

import main.ride_sharing_app.websocket.dto.LocationUpdateDTO;
import main.ride_sharing_app.websocket.util.WebSocketConverter;
import main.ride_sharing_app.websocket.message.LocationUpdateMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.handler.annotation.DestinationVariable;

@Controller
public class LocationWebSocketController {

    @MessageMapping("/driver.location/{driverId}")
    @SendTo("/topic/drivers/{driverId}/location")
    public LocationUpdateDTO handleLocationUpdate(
        @DestinationVariable Long driverId,
        LocationUpdateDTO dto
    ) {
        System.out.println("Received location update: " + dto);
        LocationUpdateMessage message = WebSocketConverter.toMessage(dto);
        return WebSocketConverter.toDTO(message);
    }
} 