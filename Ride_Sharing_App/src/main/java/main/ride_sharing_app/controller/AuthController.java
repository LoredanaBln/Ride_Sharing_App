package main.ride_sharing_app.controller;

import main.ride_sharing_app.dto.LoginRequest;
import main.ride_sharing_app.model.Driver;
import main.ride_sharing_app.model.DriverStatus;
import main.ride_sharing_app.security.JwtUtils;
import main.ride_sharing_app.service.DriverService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final DriverService driverService;

    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils, DriverService driverService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.driverService = driverService;
    }
    
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        String token = jwtUtils.generateToken(userDetails.getUsername(), role);

        Driver driver =  driverService.findByEmail(userDetails.getUsername()).orElse(null);
        if (driver != null) {
            driver.setStatus(DriverStatus.OFFLINE);
            driverService.updateDriver(driver);
        }
        
        return ResponseEntity.ok(token);
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Admin login attempt for: " + loginRequest.getEmail()); // Debug log
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    "ADMIN:" + loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            System.out.println("Admin authenticated successfully: " + userDetails.getUsername()); // Debug log
            
            String token = jwtUtils.generateToken(userDetails.getUsername(), "ROLE_ADMIN");
            return ResponseEntity.ok(token);
        } catch (AuthenticationException e) {
            System.out.println("Admin authentication failed: " + e.getMessage()); // Debug log
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid email or password");
        }
    }
} 