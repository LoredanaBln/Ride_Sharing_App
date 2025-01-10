package main.ride_sharing_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentIntentDTO {
    private String id;
    private String clientSecret;
    private Double amount;
} 