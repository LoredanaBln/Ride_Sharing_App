package main.ride_sharing_app.service.ControllerTests;

import main.ride_sharing_app.controller.PassengerController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class PassengerControllerTest {
    @Autowired
    private PassengerController passengerController;

    @Test
    void getDPassengerById() {
        assert(passengerController.getPassenger(1L).getStatusCode().is2xxSuccessful());
    }
}
