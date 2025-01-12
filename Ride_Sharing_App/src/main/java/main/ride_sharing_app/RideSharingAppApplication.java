package main.ride_sharing_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@ComponentScan(basePackages = {
    "main.ride_sharing_app.controller",
    "main.ride_sharing_app.websocket",
    "main.ride_sharing_app.websocket.controller",
    "main.ride_sharing_app.service",
    "main.ride_sharing_app.configuration",
    "main.ride_sharing_app.security",
    "main.ride_sharing_app.repository",
})
public class RideSharingAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(RideSharingAppApplication.class, args);
        System.out.println("It ran successfully");
    }

}
