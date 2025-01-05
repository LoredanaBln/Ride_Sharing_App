package main.ride_sharing_app.configuration;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordEncoderConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new PasswordEncoder() {
            private final Argon2 argon2 = Argon2Factory.create(
                Argon2Factory.Argon2Types.ARGON2id,
                16,  // Salt length
                32  //  Hash length
            );

            @Override
            public String encode(CharSequence rawPassword) {
                return argon2.hash(2,  // Iterations
                    15 * 1024,  // Memory in KiB
                    1,          // Parallelism
                    rawPassword.toString().toCharArray());
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                return argon2.verify(encodedPassword, rawPassword.toString().toCharArray());
            }
        };
    }
} 