package model;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "passengers")
public class Passenger implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

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

    @Lob
    @Column(name = "profile_image")
    private byte[] imageData;

}
