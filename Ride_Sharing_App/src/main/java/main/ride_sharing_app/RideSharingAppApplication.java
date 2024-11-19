package main.ride_sharing_app;

import model.Driver;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import service.DriverService;
import single_point_access.ServiceSinglePointAccess;

@SpringBootApplication
public class RideSharingAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(RideSharingAppApplication.class, args);
        System.out.println("It ran successfully");

        DriverService driverService = ServiceSinglePointAccess.driverService();
        byte[] imageData = new byte[]{10, 20, 30, 40, 50}; // Just an example

        // Create a Driver object using the constructor
        Driver driver = new Driver();
        driver.setName("afaa");
        driver.setEmail("afaa");
        driver.setPhoneNumber("afaa");
        driver.setPassword("afaa");
        driverService.save(driver);

    }

}
