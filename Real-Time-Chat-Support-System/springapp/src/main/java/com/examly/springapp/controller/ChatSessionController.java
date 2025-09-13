package com.examly.springapp.controller;

import com.examly.springapp.model.ChatSession;
import com.examly.springapp.repository.ChatSessionRepository;
import com.examly.springapp.service.ChatService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat-sessions")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatSessionController {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatService chatService;

    @Autowired
    public ChatSessionController(ChatSessionRepository chatSessionRepository, ChatService chatService) {
        this.chatSessionRepository = chatSessionRepository;
        this.chatService = chatService;
    }

    @GetMapping
    public List<ChatSession> getAllSessions() {
        return chatSessionRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/user/{userId}")
    public List<ChatSession> getSessionsByUser(@PathVariable Long userId) {
        return chatSessionRepository.findByCustomerIdOrderByCreatedAtDesc(userId);
    }

    @GetMapping("/agent/{agentId}")
    public List<ChatSession> getSessionsByAgent(@PathVariable Long agentId) {
        return chatSessionRepository.findByAgentIdOrderByCreatedAtDesc(agentId);
    }

    @PostMapping
    public ChatSession createSession(@RequestBody(required = false) Map<String, Object> request) {
        if (request != null && request.containsKey("customerId")) {
            Long customerId = Long.valueOf(request.get("customerId").toString());
            return chatService.createSession(customerId);
        }
        return chatService.createSession();
    }

    @PostMapping("/close/{sessionId}")
    public ChatSession closeSession(@PathVariable Long sessionId) {
        return chatService.closeSession(sessionId);
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<?> deleteSession(@PathVariable Long sessionId) {
        try {
            chatSessionRepository.deleteById(sessionId);
            return ResponseEntity.ok("Session deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete session");
        }
    }
}
