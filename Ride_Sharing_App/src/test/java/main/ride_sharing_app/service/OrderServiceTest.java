package main.ride_sharing_app.service;

import main.ride_sharing_app.model.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OrderServiceTest {
    @Autowired
    OrderService orderService;
    @Autowired
    DriverService driverService;
    @Autowired
    PassengerService passengerService;

    @Test
    void createOrder() {

        LocalDateTime startTime = LocalDateTime.of(2025, 11, 25, 10, 0);
        LocalDateTime endTime = LocalDateTime.of(2025, 11, 25, 10, 30);
        Driver driver = driverService.getDriverById(1L);
        Passenger passenger = passengerService.getPassengerById(1L);


        Order order = new Order(
                driver,
                passenger,
                "123 Main Street",
                "456 Elm Street",
                OrderStatus.COMPLETED,
                25.50,
                PaymentType.CREDIT_CARD,
                startTime,
                endTime
        );
        orderService.createOrder(order);
    }

    @Test
    void deleteOrder() {
    }

    @Test
    void deleteOrderById() {
    }

    @Test
    void getOrderById() {
    }

    @Test
    void getAllOrders() {
    }
}