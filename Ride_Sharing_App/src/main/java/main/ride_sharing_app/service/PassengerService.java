package main.ride_sharing_app.service;

import main.ride_sharing_app.model.Passenger;
import main.ride_sharing_app.repository.PassengerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PassengerService {

    private final PassengerRepository passengerRepository;

    public PassengerService(PassengerRepository passengerRepository) {
        this.passengerRepository = passengerRepository;
    }

    public Passenger createPassenger(Passenger passenger){
        return passengerRepository.save(passenger);
    }

    public void deletePassenger(Passenger passenger){
        passengerRepository.delete(passenger);
    }

    public Passenger getPassengerById(Long id) {
        return passengerRepository.findById(id).orElseThrow(() -> new RuntimeException("Passenger not found"));
    }

    public List<Passenger> getAllPassengers() {
        return passengerRepository.findAll();
    }

    public void deletePassengerById(Long id) {
        passengerRepository.deleteById(id);
    }
}
