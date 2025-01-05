package main.ride_sharing_app.configuration;

import main.ride_sharing_app.security.CustomUserDetailsService;
import main.ride_sharing_app.security.JwtAuthenticationFilter;
import main.ride_sharing_app.security.JwtUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtUtils jwtUtils, CustomUserDetailsService userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .securityContext(context -> context
                        .requireExplicitSave(true)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/driver/id/{id}", "/passenger/id/{id}").permitAll()
                        .requestMatchers("/passenger/signUp", "/driver/signUp").permitAll()
                        .requestMatchers("/auth/login").permitAll()
                        .requestMatchers("/passenger/requestPasswordReset", "/passenger/confirmPasswordReset").permitAll()
                        .requestMatchers("/driver/requestPasswordReset", "/driver/confirmPasswordReset").permitAll()
                        .requestMatchers("/order/nearbyDrivers").permitAll()
                        .requestMatchers("/order/id/{id}").permitAll()
                        .requestMatchers("/test/geocode", "/test/route").permitAll()
                        .requestMatchers("/auth/admin/login").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtUtils, userDetailsService),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
