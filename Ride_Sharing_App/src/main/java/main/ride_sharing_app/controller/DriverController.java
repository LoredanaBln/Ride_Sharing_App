package main.ride_sharing_app.controller;

import main.ride_sharing_app.model.Driver;
import main.ride_sharing_app.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/driver")
public class DriverController {
    @Autowired
    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @PostMapping("/signUp")
    public ResponseEntity<Driver> signUpDriver(@RequestBody Driver driver) {
        return ResponseEntity.status(HttpStatus.OK).body(driverService.createDriver(driver));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Optional<Driver>> getDriver(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(driverService.getDriverById(id));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable("id") Long id) {
        driverService.deleteDriverById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> delete(@RequestBody Driver driver) {
        driverService.deleteDriver(driver);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PutMapping("/update")
    public ResponseEntity<Driver> updateDriver(@RequestBody Driver driver) {
       return ResponseEntity.status(HttpStatus.OK).body(driverService.updateDriver(driver));
    }
}
