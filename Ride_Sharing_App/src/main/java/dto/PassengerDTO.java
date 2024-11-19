package dto;

import lombok.Data;

@Data
public class PassengerDTO {
    private Integer passengerId;
    private String name;
    private String email;
    private String phoneNumber;
    private Double rating;
    private byte[] profileImage;

    public PassengerDTO(Integer passengerId, String name, String email, String phoneNumber, Double rating, byte[] profileImage) {
        this.passengerId = passengerId;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.rating = rating;
        this.profileImage = profileImage;
    }

    public Integer getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Integer passengerId) {
        this.passengerId = passengerId;
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

    public byte[] getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(byte[] profileImage) {
        this.profileImage = profileImage;
    }
}
