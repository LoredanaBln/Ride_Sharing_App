package main.ride_sharing_app.service;

import main.ride_sharing_app.model.Passenger;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class PassengerServiceTest {
    @Autowired
    PassengerService passengerService;

    @Test
    void testCreatePassenger(){
        byte[] sampleImageData = {1, 2, 3, 4, 5};

        Passenger passenger = new Passenger(
                "John Doe",
                "johndoe@example.com",
                "123-456-7890",
                "securePassword123",
                4.8,
                sampleImageData
        );

        Passenger savedPassenger = passengerService.createPassenger(passenger);
        assertNotNull(savedPassenger.getId());
    }

}