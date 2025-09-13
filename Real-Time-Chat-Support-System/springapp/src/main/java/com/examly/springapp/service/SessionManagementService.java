package com.examly.springapp.service;

import com.examly.springapp.model.ChatSession;
import com.examly.springapp.repository.ChatSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class SessionManagementService {

    @Autowired
    private ChatSessionRepository chatSessionRepository;

    public ChatSession createSession(Long customerId, Long agentId) {
        ChatSession session = ChatSession.builder()
                .customerId(customerId)
                .agentId(agentId)
                .status(ChatSession.Status.ACTIVE)
                .build();
        return chatSessionRepository.save(session);
    }

    public ChatSession closeSession(ChatSession session) {
        session.setStatus(ChatSession.Status.CLOSED);
        session.setEndTime(LocalDateTime.now());
        return chatSessionRepository.save(session);
    }
    public ChatSession getChatSessionById(Long sessionId) {
        Optional<ChatSession> sessionOpt = chatSessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            return sessionOpt.get();
        } else {
            throw new RuntimeException("ChatSession not found for id: " + sessionId);
        }
    }
}
