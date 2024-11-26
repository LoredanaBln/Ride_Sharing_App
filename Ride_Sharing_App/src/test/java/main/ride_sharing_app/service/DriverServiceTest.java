package main.ride_sharing_app.service;

import main.ride_sharing_app.model.Driver;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class DriverServiceTest {
    @Autowired
    private DriverService driverService;

    @Test
    void testCreateDriver() {
        Driver driver = new Driver(
                "Jane Doe",
                "janneta.doe@example.com",
                "passwordHash",
                "+1234567890",
                "http://example.com/images/john.jpg",
                "Active",
                4.9,
                "SUV",
                "XYZ1666",
                "Blue"
        );
        Driver savedDriver = driverService.createDriver(driver);
        assertNotNull(savedDriver.getId());
    }


}
