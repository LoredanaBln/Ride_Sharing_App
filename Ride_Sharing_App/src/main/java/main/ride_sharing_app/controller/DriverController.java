package main.ride_sharing_app.controller;

import main.ride_sharing_app.dto.PasswordChangeRequest;
import main.ride_sharing_app.dto.PasswordResetRequest;
import main.ride_sharing_app.dto.PasswordResetConfirmation;
import main.ride_sharing_app.model.Driver;
import main.ride_sharing_app.model.Order;
import main.ride_sharing_app.service.DriverService;
import main.ride_sharing_app.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/driver")
public class DriverController {
    @Autowired
    private final DriverService driverService;
    @Autowired
    private final OrderService orderService;

    public DriverController(DriverService driverService, OrderService orderService) {
        this.driverService = driverService;
        this.orderService = orderService;
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

    @PostMapping("/requestPasswordReset")
    public ResponseEntity<Void> requestPasswordReset(@RequestBody PasswordResetRequest request) {
        driverService.requestPasswordReset(request.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/confirmPasswordReset")
    public ResponseEntity<Void> confirmPasswordReset(@RequestBody PasswordResetConfirmation request) {
        driverService.confirmPasswordReset(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/changePassword")
    public ResponseEntity<Void> changePassword(
        @RequestBody PasswordChangeRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            // Get driver by email from authenticated user
            Driver driver = driverService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            driverService.changePassword(
                driver.getId(),
                request.getOldPassword(), 
                request.getNewPassword()
            );
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/updateLocation")
    public ResponseEntity<Driver> updateLocation(
        @RequestParam Double latitude,
        @RequestParam Double longitude,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        Driver driver = driverService.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Driver not found"));
            
        driver.setLastLatitude(latitude);
        driver.setLastLongitude(longitude);
        driver.setLocationUpdatedAt(LocalDateTime.now());
        
        return ResponseEntity.ok(driverService.updateDriver(driver));
    }

    @PostMapping("/order/{orderId}/respond")
    public ResponseEntity<Order> respondToOrder(
        @PathVariable Long orderId,
        @RequestParam boolean accept,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        Driver driver = driverService.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Driver not found"));
            
        Order updatedOrder = orderService.handleDriverResponse(orderId, driver.getId(), accept);
        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("email/{email}")
    public ResponseEntity<Driver> getDriverByEmail(@PathVariable String email) {
        return driverService.findByEmail(email)
                .map(driver -> ResponseEntity.ok().body(driver))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
