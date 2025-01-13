package main.ride_sharing_app.websocket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverInfoDTO {
    private String name;
    private String phoneNumber;
    private String carType;
    private String carColor;
    private Double rating;
} 