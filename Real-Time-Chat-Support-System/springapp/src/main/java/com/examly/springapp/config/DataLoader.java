package com.examly.springapp.config;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Delete existing admin if exists
        userRepository.findByEmail("admin@example.com").ifPresent(userRepository::delete);
        
        if (userRepository.count() == 0) {
            // Create default customer
            User customer = User.builder()
                    .username("customer")
                    .email("customer@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(User.Role.CUSTOMER)
                    .status(User.Status.OFFLINE)
                    .build();
            userRepository.save(customer);

            // Create default agent
            User agent = User.builder()
                    .username("agent")
                    .email("agent@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(User.Role.AGENT)
                    .status(User.Status.OFFLINE)
                    .build();
            userRepository.save(agent);

            // Create default admin
            User admin = User.builder()
                    .username("admin")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .status(User.Status.OFFLINE)
                    .build();
            userRepository.save(admin);

            System.out.println("Default users created:");
            System.out.println("Customer: customer@example.com / password123");
            System.out.println("Agent: agent@example.com / password123");
            System.out.println("Admin: admin@example.com / admin123");
        } else {
            // Ensure admin exists even if other users exist
            if (!userRepository.findByEmail("admin@example.com").isPresent()) {
                User admin = User.builder()
                        .username("admin")
                        .email("admin@example.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(User.Role.ADMIN)
                        .status(User.Status.OFFLINE)
                        .build();
                userRepository.save(admin);
                System.out.println("Admin user created: admin@example.com / admin123");
            }
        }
    }
}