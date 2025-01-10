    package main.ride_sharing_app.controller;

    import main.ride_sharing_app.dto.PasswordChangeRequest;
    import main.ride_sharing_app.dto.PasswordResetRequest;
    import main.ride_sharing_app.dto.PasswordResetConfirmation;
    import main.ride_sharing_app.model.Driver;
    import main.ride_sharing_app.model.Passenger;
    import main.ride_sharing_app.service.PassengerService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.security.core.annotation.AuthenticationPrincipal;
    import org.springframework.security.core.userdetails.UserDetails;
    import main.ride_sharing_app.model.Order;
    import java.util.List;

    @RestController
    @RequestMapping("/passenger")
    public class PassengerController {
        private final PassengerService passengerService;

        public PassengerController(PassengerService passengerService) {
            this.passengerService = passengerService;
        }

        @GetMapping("/id/{id}")
        public ResponseEntity<Passenger> getPassenger(@PathVariable Long id) {
            return ResponseEntity.status(HttpStatus.OK).body(passengerService.getPassengerById(id));
        }

        @PostMapping("/signUp")
        public ResponseEntity<Passenger> signUpPassenger(@RequestBody Passenger passenger) {
            return ResponseEntity.status(HttpStatus.OK).body(passengerService.createPassenger(passenger));
        }

        @DeleteMapping("/delete/{id}")
        public ResponseEntity<Void> deleteById(@PathVariable("id") Long id) {
            passengerService.deletePassengerById(id);
            return ResponseEntity.status(HttpStatus.OK).build();
        }

        @DeleteMapping("/delete")
        public ResponseEntity<Void> delete(@RequestBody Passenger passenger) {
            passengerService.deletePassenger(passenger);
            return ResponseEntity.status(HttpStatus.OK).build();
        }

        @PutMapping("/update")
        public  ResponseEntity<Passenger> updatePassenger(@RequestBody Passenger passenger) {
            return ResponseEntity.status(HttpStatus.OK).body(passengerService.updatePassenger(passenger));
        }

        @PutMapping("/changePassword")
        public ResponseEntity<Void> changePassword(
            @RequestBody PasswordChangeRequest request,
            @AuthenticationPrincipal UserDetails userDetails
        ) {
            try {
                // Get passenger by email from authenticated user
                Passenger passenger = passengerService.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Passenger not found"));
                
                passengerService.changePassword(
                    passenger.getId(),
                    request.getOldPassword(), 
                    request.getNewPassword()
                );
                return ResponseEntity.ok().build();
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        @PostMapping("/requestPasswordReset")
        public ResponseEntity<Void> requestPasswordReset(@RequestBody PasswordResetRequest request) {
            passengerService.requestPasswordReset(request.getEmail());
            return ResponseEntity.ok().build();
        }

        @PostMapping("/confirmPasswordReset")
        public ResponseEntity<Void> confirmPasswordReset(@RequestBody PasswordResetConfirmation request) {
            passengerService.confirmPasswordReset(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok().build();
        }

    }
