package main.ride_sharing_app.service;

import main.ride_sharing_app.model.Driver;
import main.ride_sharing_app.repository.DriverRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    public Driver createDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    public void deleteDriverById(Long id) {
        driverRepository.deleteById(id);
    }

    public void deleteDriver(Driver driver) {
        driverRepository.delete(driver);
    }

    public Driver getDriverById(Long id) {
        return driverRepository.findById(id).orElseThrow(() -> new RuntimeException("Driver not found"));
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }
}