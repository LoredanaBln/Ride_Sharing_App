package dto;

import lombok.Data;

@Data
public class DriverDTO {
    private Integer driverId;
    private String name;
    private String email;
    private String phoneNumber;
    private Double rating;
    private String carType;
    private String carColor;
    private String licenseNumber;
    private byte[] profileImage;

    public DriverDTO(Integer driverId, String name, String email, String phoneNumber, Double rating, String carType, String carColor, String licenseNumber, byte[] profileImage) {
        this.driverId = driverId;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.rating = rating;
        this.carType = carType;
        this.carColor = carColor;
        this.licenseNumber = licenseNumber;
        this.profileImage = profileImage;
    }

    public Integer getDriverId() {
        return driverId;
    }

    public void setDriverId(Integer driverId) {
        this.driverId = driverId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getCarType() {
        return carType;
    }

    public void setCarType(String carType) {
        this.carType = carType;
    }

    public String getCarColor() {
        return carColor;
    }

    public void setCarColor(String carColor) {
        this.carColor = carColor;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public byte[] getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(byte[] profileImage) {
        this.profileImage = profileImage;
    }
}
