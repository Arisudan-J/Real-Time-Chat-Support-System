package com.examly.springapp.service;

import com.examly.springapp.model.ChatMessage;
import com.examly.springapp.model.ChatSession;
import com.examly.springapp.repository.ChatMessageRepository;
import com.examly.springapp.repository.ChatSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ChatSessionRepository chatSessionRepository;

    public ChatMessage saveMessage(ChatMessage message) {
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getMessages(Long sessionId) {
        return chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
    }

    public ChatSession createSession(Long customerId) {
        ChatSession session = ChatSession.builder()
                .customerId(customerId)
                .status(ChatSession.Status.WAITING)
                .build();
        return chatSessionRepository.save(session);
    }

    public ChatSession createSession() {
        ChatSession session = ChatSession.builder()
                .status(ChatSession.Status.WAITING)
                .build();
        return chatSessionRepository.save(session);
    }

    public ChatSession closeSession(Long sessionId) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setStatus(ChatSession.Status.CLOSED);
        session.setEndTime(LocalDateTime.now());
        return chatSessionRepository.save(session);
    }
}
