package main.ride_sharing_app.security;

import main.ride_sharing_app.model.Driver;
import main.ride_sharing_app.model.Passenger;
import main.ride_sharing_app.repository.DriverRepository;
import main.ride_sharing_app.repository.PassengerRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final DriverRepository driverRepository;
    private final PassengerRepository passengerRepository;

    public CustomUserDetailsService(DriverRepository driverRepository, PassengerRepository passengerRepository) {
        this.driverRepository = driverRepository;
        this.passengerRepository = passengerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Driver> driver = driverRepository.findByEmail(email);
        if (driver.isPresent()) {
            return new User(driver.get().getEmail(), 
                          driver.get().getPasswordHash(),
                          Collections.singletonList(new SimpleGrantedAuthority("ROLE_DRIVER")));
        }

        Optional<Passenger> passenger = passengerRepository.findByEmail(email);
        if (passenger.isPresent()) {
            return new User(passenger.get().getEmail(),
                          passenger.get().getPassword(),
                          Collections.singletonList(new SimpleGrantedAuthority("ROLE_PASSENGER")));
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
} 