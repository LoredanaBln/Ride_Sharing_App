package main.ride_sharing_app.controller;

import main.ride_sharing_app.model.Passenger;
import main.ride_sharing_app.service.PassengerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/passenger")
public class PassengerController {
    @Autowired
    private final PassengerService passengerService;

    public PassengerController(PassengerService passengerService) {
        this.passengerService = passengerService;
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Passenger> getPassenger(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(passengerService.getPassengerById(id));
    }
}
