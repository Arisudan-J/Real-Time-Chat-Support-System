package com.examly.springapp.controller;

import com.examly.springapp.model.ChatMessage;
import com.examly.springapp.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat-messages")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatMessageController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/{sessionId}")
    public List<ChatMessage> getMessages(@PathVariable Long sessionId) {
        return chatService.getMessages(sessionId);
    }

    @PostMapping
    public ChatMessage sendMessage(@RequestBody ChatMessage message) {
        ChatMessage savedMessage = chatService.saveMessage(message);
        // Broadcast via WebSocket
        System.out.println("Broadcasting message to /topic/chat/" + message.getSessionId());
        messagingTemplate.convertAndSend("/topic/chat/" + message.getSessionId(), savedMessage);
        return savedMessage;
    }
}
