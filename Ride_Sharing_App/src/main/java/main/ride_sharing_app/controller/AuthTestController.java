package main.ride_sharing_app.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import main.ride_sharing_app.security.JwtUtils;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/test")
public class AuthTestController {
    
    private final Logger logger = LoggerFactory.getLogger(AuthTestController.class);
    private final JwtUtils jwtUtils;

    public AuthTestController(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }
    
    @GetMapping("/auth")
    public ResponseEntity<String> testAuth(Authentication authentication) {
        logger.info("Auth test - User: {}", authentication != null ? authentication.getName() : "null");
        logger.info("Auth test - Authorities: {}", authentication != null ? authentication.getAuthorities() : "null");
        return ResponseEntity.ok("Authenticated as: " + (authentication != null ? authentication.getName() : "null"));
    }

    @GetMapping("/token")
    public ResponseEntity<Map<String, String>> testToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Map<String, String> tokenInfo = new HashMap<>();
            tokenInfo.put("username", jwtUtils.getUsernameFromToken(token));
            tokenInfo.put("role", jwtUtils.getRoleFromToken(token));
            tokenInfo.put("valid", String.valueOf(jwtUtils.validateToken(token)));
            return ResponseEntity.ok(tokenInfo);
        } catch (Exception e) {
            logger.error("Token test failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 