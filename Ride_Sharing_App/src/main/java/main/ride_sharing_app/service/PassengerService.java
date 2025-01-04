package main.ride_sharing_app.service;

import main.ride_sharing_app.model.Driver;
import main.ride_sharing_app.model.Passenger;
import main.ride_sharing_app.repository.PassengerRepository;
import main.ride_sharing_app.repository.PasswordResetTokenRepository;
import main.ride_sharing_app.model.PasswordResetToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PassengerService {

    private final PassengerRepository passengerRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    public PassengerService(PassengerRepository passengerRepository, 
                          PasswordEncoder passwordEncoder,
                          PasswordResetTokenRepository tokenRepository,
                          EmailService emailService) {
        this.passengerRepository = passengerRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
    }

    public Passenger createPassenger(Passenger passenger) {
        passenger.setPassword(passwordEncoder.encode(passenger.getPassword()));
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

    public Passenger updatePassenger(Passenger passenger){
        return passengerRepository.save(passenger);
    }

    public void resetPassword(String email, String newPassword) {
        Optional<Passenger> passengerOptional = passengerRepository.findByEmail(email);
        if (passengerOptional.isPresent()) {
            Passenger passenger = passengerOptional.get();
            passenger.setPassword(passwordEncoder.encode(newPassword));
            passengerRepository.save(passenger);
        } else {
            throw new RuntimeException("Passenger not found");
        }
    }

    public void changePassword(Long id, String oldPassword, String newPassword) {
        Optional<Passenger> passengerOptional = passengerRepository.findById(id);
        if (passengerOptional.isPresent()) {
            Passenger passenger = passengerOptional.get();
            if (passwordEncoder.matches(oldPassword, passenger.getPassword())) {
                passenger.setPassword(passwordEncoder.encode(newPassword));
                passengerRepository.save(passenger);
            } else {
                throw new RuntimeException("Old password is incorrect");
            }
        } else {
            throw new RuntimeException("Passenger not found");
        }
    }

    public Optional<Passenger> findByEmail(String email) {
        return passengerRepository.findByEmail(email);
    }

    public void requestPasswordReset(String email) {
        Optional<Passenger> passenger = passengerRepository.findByEmail(email);
        if (passenger.isPresent()) {
            String token = generateRandomToken();
            PasswordResetToken resetToken = new PasswordResetToken(token, email);
            tokenRepository.save(resetToken);
            emailService.sendPasswordResetToken(email, token);
        } else {
            throw new RuntimeException("Passenger not found");
        }
    }

    public void confirmPasswordReset(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByTokenAndUsedFalse(token)
            .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        if (resetToken.isExpired()) {
            throw new RuntimeException("Token has expired");
        }

        Optional<Passenger> passenger = passengerRepository.findByEmail(resetToken.getEmail());
        if (passenger.isPresent()) {
            Passenger passengerEntity = passenger.get();
            passengerEntity.setPassword(passwordEncoder.encode(newPassword));
            passengerRepository.save(passengerEntity);

            resetToken.setUsed(true);
            tokenRepository.save(resetToken);
        } else {
            throw new RuntimeException("Passenger not found");
        }
    }

    private String generateRandomToken() {
        return UUID.randomUUID().toString();
    }
}
