package model;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Entity
@Table(name = "drivers")
@Data
@Access(AccessType.FIELD)
public class DriverR implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "car_type")
    private String carType;

    @Column(name = "license_number")
    private String licenseNumber;

    @Column(name = "car_color")
    private String carColor;

    @Lob
    @Column(name = "profile_image")
    private byte[] imageData;

    public DriverR() {
    }

}