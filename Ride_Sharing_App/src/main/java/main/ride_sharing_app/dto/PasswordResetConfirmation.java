package main.ride_sharing_app.dto;

import lombok.Data;

@Data
public class PasswordResetConfirmation {
    private String token;
    private String newPassword;
} 