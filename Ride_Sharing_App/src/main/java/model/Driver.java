package model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "drivers")
@Data
public class Driver implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column
    private String name;

    @Column
    private String email;

    @Column
    private String phoneNumber;

    @Column
    private String password;

    @Column
    private Double rating;

    @Column
    private String carType;

    @Column
    private String licenseNumber;

    @Column
    private String carColor;

    @Column
    private byte[] imageData;

    public Driver() {
    }

    public Driver(String name, String email, String phoneNumber, String password, Double rating, String carType, String licenseNumber, String carColor, byte[] imageData) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.rating = rating;
        this.carType = carType;
        this.licenseNumber = licenseNumber;
        this.carColor = carColor;
        this.imageData = imageData;
    }
}