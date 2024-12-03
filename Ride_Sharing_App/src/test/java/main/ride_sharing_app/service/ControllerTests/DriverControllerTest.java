package main.ride_sharing_app.service.ControllerTests;

import main.ride_sharing_app.controller.DriverController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class DriverControllerTest {
    @Autowired
    private DriverController driverController;

    @Test
    void getDriverById() {
        assert(driverController.getDriver(1L).getStatusCode().is2xxSuccessful());
    }
}
