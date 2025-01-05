package main.ride_sharing_app.security;

import main.ride_sharing_app.model.Driver;
import main.ride_sharing_app.model.Passenger;
import main.ride_sharing_app.model.Admin;
import main.ride_sharing_app.repository.DriverRepository;
import main.ride_sharing_app.repository.PassengerRepository;
import main.ride_sharing_app.repository.AdminRepository;
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
    private final AdminRepository adminRepository;

    public CustomUserDetailsService(DriverRepository driverRepository, PassengerRepository passengerRepository, AdminRepository adminRepository) {
        this.driverRepository = driverRepository;
        this.passengerRepository = passengerRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("Attempting to load user: " + username); // Debug log

        if (username.startsWith("ADMIN:")) {
            String adminEmail = username.substring(6);
            System.out.println("Looking for admin with email: " + adminEmail); // Debug log
            
            Admin admin = adminRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found"));
            
            System.out.println("Found admin: " + admin.getEmail()); // Debug log
            
            return User.builder()
                .username(admin.getEmail())
                .password(admin.getPassword())
                .authorities("ROLE_ADMIN")
                .build();
        }
        
        Optional<Driver> driver = driverRepository.findByEmail(username);
        if (driver.isPresent()) {
            return new User(driver.get().getEmail(), 
                          driver.get().getPasswordHash(),
                          Collections.singletonList(new SimpleGrantedAuthority("ROLE_DRIVER")));
        }

        Optional<Passenger> passenger = passengerRepository.findByEmail(username);
        if (passenger.isPresent()) {
            return new User(passenger.get().getEmail(),
                          passenger.get().getPassword(),
                          Collections.singletonList(new SimpleGrantedAuthority("ROLE_PASSENGER")));
        }

        throw new UsernameNotFoundException("User not found with email: " + username);
    }
} 