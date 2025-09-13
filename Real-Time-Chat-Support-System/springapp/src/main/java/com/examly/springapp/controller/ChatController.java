package com.examly.springapp.controller;

import com.examly.springapp.model.ChatMessage;
import com.examly.springapp.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{sessionId}")
    public void sendMessage(@DestinationVariable String sessionId, ChatMessage message) {
        try {
            ChatMessage savedMessage = chatService.saveMessage(message);
            messagingTemplate.convertAndSend("/topic/chat/" + sessionId, savedMessage);
        } catch (Exception e) {
            System.err.println("Error sending message: " + e.getMessage());
        }
    }

    @MessageMapping("/typing/{sessionId}")
    public void handleTyping(@DestinationVariable String sessionId, Object typingData) {
        messagingTemplate.convertAndSend("/topic/typing/" + sessionId, typingData);
    }
}
