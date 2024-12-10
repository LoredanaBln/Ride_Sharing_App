    package main.ride_sharing_app.controller;

    import main.ride_sharing_app.model.Driver;
    import main.ride_sharing_app.model.Passenger;
    import main.ride_sharing_app.service.PassengerService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

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
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        @DeleteMapping("/delete")
        public ResponseEntity<Void> delete(@RequestBody Passenger passenger) {
            passengerService.deletePassenger(passenger);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }
