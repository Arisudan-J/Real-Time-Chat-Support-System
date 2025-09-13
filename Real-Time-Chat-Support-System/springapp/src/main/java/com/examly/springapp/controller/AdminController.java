package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteById(userId);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete user");
        }
    }

    @PostMapping("/create-agent")
    public ResponseEntity<?> createAgent(@RequestBody Map<String, String> request) {
        try {
            User agent = User.builder()
                    .username(request.get("username"))
                    .email(request.get("email"))
                    .password(passwordEncoder.encode(request.get("password")))
                    .role(User.Role.AGENT)
                    .status(User.Status.OFFLINE)
                    .build();
            userService.saveUser(agent);
            return ResponseEntity.ok("Agent created successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create agent");
        }
    }
}