package main.ride_sharing_app.service;

import main.ride_sharing_app.model.Driver;
import main.ride_sharing_app.repository.DriverRepository;
import main.ride_sharing_app.repository.PasswordResetTokenRepository;
import main.ride_sharing_app.service.EmailService;
import main.ride_sharing_app.model.PasswordResetToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DriverService {

    private final DriverRepository driverRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    public DriverService(DriverRepository driverRepository, PasswordEncoder passwordEncoder, PasswordResetTokenRepository tokenRepository, EmailService emailService) {
        this.driverRepository = driverRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
    }

    public Driver createDriver(Driver driver) {
        driver.setPasswordHash(passwordEncoder.encode(driver.getPasswordHash()));
        return driverRepository.save(driver);
    }

    public void deleteDriverById(Long id) {
        driverRepository.deleteById(id);
    }

    public void deleteDriver(Driver driver) {
        driverRepository.delete(driver);
    }

    public Optional<Driver> getDriverById(Long id) {
        return driverRepository.findById(id);
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public Driver updateDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    public void resetPassword(String email, String newPassword) {
        Optional<Driver> driverOptional = driverRepository.findByEmail(email);
        if (driverOptional.isPresent()) {
            Driver driver = driverOptional.get();
            driver.setPasswordHash(passwordEncoder.encode(newPassword));
            driverRepository.save(driver);
        } else {
            throw new RuntimeException("Driver not found");
        }
    }

    public void changePassword(Long id, String oldPassword, String newPassword) {
        Optional<Driver> driverOptional = driverRepository.findById(id);
        if (driverOptional.isPresent()) {
            Driver driver = driverOptional.get();
            if (passwordEncoder.matches(oldPassword, driver.getPasswordHash())) {
                driver.setPasswordHash(passwordEncoder.encode(newPassword));
                driverRepository.save(driver);
            } else {
                throw new RuntimeException("Old password is incorrect");
            }
        } else {
            throw new RuntimeException("Driver not found");
        }
    }

    public Optional<Driver> findByEmail(String email) {
        return driverRepository.findByEmail(email);
    }

    public void requestPasswordReset(String email) {
        Optional<Driver> driver = driverRepository.findByEmail(email);
        if (driver.isPresent()) {
            String token = generateRandomToken();
            PasswordResetToken resetToken = new PasswordResetToken(token, email);
            tokenRepository.save(resetToken);
            emailService.sendPasswordResetToken(email, token);
        } else {
            throw new RuntimeException("Driver not found");
        }
    }

    public void confirmPasswordReset(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByTokenAndUsedFalse(token)
            .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        if (resetToken.isExpired()) {
            throw new RuntimeException("Token has expired");
        }

        Optional<Driver> driver = driverRepository.findByEmail(resetToken.getEmail());
        if (driver.isPresent()) {
            Driver driverEntity = driver.get();
            driverEntity.setPasswordHash(passwordEncoder.encode(newPassword));
            driverRepository.save(driverEntity);

            resetToken.setUsed(true);
            tokenRepository.save(resetToken);
        } else {
            throw new RuntimeException("Driver not found");
        }
    }

    private String generateRandomToken() {
        return UUID.randomUUID().toString();
    }
}
