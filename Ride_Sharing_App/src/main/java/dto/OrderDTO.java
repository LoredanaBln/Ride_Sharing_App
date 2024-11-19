package dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderDTO {
    private Integer orderId;
    private DriverDTO driverDTO;
    private PassengerDTO passengerDTO;
    private String startLocation;
    private String endLocation;
    private String status;
    private Double price;
    private String paymentType;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public OrderDTO(Integer orderId, DriverDTO driverDTO, PassengerDTO passengerDTO, String startLocation, String endLocation, String status, Double price, String paymentType, LocalDateTime startTime, LocalDateTime endTime) {
        this.orderId = orderId;
        this.driverDTO = driverDTO;
        this.passengerDTO = passengerDTO;
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.status = status;
        this.price = price;
        this.paymentType = paymentType;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public DriverDTO getDriverDTO() {
        return driverDTO;
    }

    public void setDriverDTO(DriverDTO driverDTO) {
        this.driverDTO = driverDTO;
    }

    public PassengerDTO getPassengerDTO() {
        return passengerDTO;
    }

    public void setPassengerDTO(PassengerDTO passengerDTO) {
        this.passengerDTO = passengerDTO;
    }

    public String getStartLocation() {
        return startLocation;
    }

    public void setStartLocation(String startLocation) {
        this.startLocation = startLocation;
    }

    public String getEndLocation() {
        return endLocation;
    }

    public void setEndLocation(String endLocation) {
        this.endLocation = endLocation;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(String paymentType) {
        this.paymentType = paymentType;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
}
