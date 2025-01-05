package main.ride_sharing_app.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "driver_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "car_type", nullable = false)
    private String carType;

    @Column(name = "license_number", nullable = false, unique = true)
    private String licenseNumber;

    @Column(name = "car_color", nullable = false)
    private String carColor;

    @Column(name = "last_latitude")
    private Double lastLatitude;

    @Column(name = "last_longitude")
    private Double lastLongitude;

    @Column(name = "location_updated_at")
    private LocalDateTime locationUpdatedAt;

    public Driver(String name, String email, String passwordHash, String phoneNumber,
                  String profilePicture, String status, Double rating, String carType,
                  String licenseNumber, String carColor) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.phoneNumber = phoneNumber;
        this.profilePicture = profilePicture;
        this.status = status;
        this.rating = rating;
        this.carType = carType;
        this.licenseNumber = licenseNumber;
        this.carColor = carColor;
    }

}
