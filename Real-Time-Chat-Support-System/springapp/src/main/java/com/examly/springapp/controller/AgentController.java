package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agents")
@CrossOrigin(origins = "http://localhost:3000")
public class AgentController {

    @Autowired
    private UserService userService;

    @GetMapping("/available")
    public List<User> getAvailableAgents() {
        return userService.findByRole(User.Role.AGENT);
    }

    @PutMapping("/status")
    public ResponseEntity<?> updateStatus(@RequestBody Map<String, String> request) {
        String status = request.get("status");
        // For now, just return success - can be enhanced later
        return ResponseEntity.ok("Status updated to: " + status);
    }
}
