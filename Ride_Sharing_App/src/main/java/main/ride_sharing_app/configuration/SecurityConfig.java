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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .securityContext(context -> context
                        .requireExplicitSave(true)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/driver/id/{id}", "/passenger/id/{id}").permitAll()
                        .requestMatchers("/driver/toggleOnline").permitAll()
                        .requestMatchers("/passenger/signUp", "/driver/signUp").permitAll()
                        .requestMatchers("/passenger/email/{email}").permitAll()
                        .requestMatchers("/driver/email/{email}").permitAll()
                        .requestMatchers("driver/update").permitAll()
                        .requestMatchers("/auth/login").permitAll()
                        .requestMatchers("order/passengerOrder").permitAll()
                        .requestMatchers("/passenger/requestPasswordReset", "/passenger/confirmPasswordReset").permitAll()
                        .requestMatchers("/driver/requestPasswordReset", "/driver/confirmPasswordReset").permitAll()
                        .requestMatchers("/order/nearbyDrivers").permitAll()
                        .requestMatchers("/order/id/{id}").permitAll()
                        .requestMatchers("/location/geocode", "/location/route").permitAll()
                        .requestMatchers("/testMap/geocode", "/testMap/route").permitAll()
                        .requestMatchers("/auth/admin/login").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/payment/methods/{paymentMethodId}/setDefault").authenticated()
                        .requestMatchers("/payment/**").authenticated()
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

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
