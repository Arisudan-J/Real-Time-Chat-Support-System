package com.examly.springapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examly.springapp.model.ChatSession;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    List<ChatSession> findByCustomerId(Long customerId);
    List<ChatSession> findByAgentId(Long agentId);
    List<ChatSession> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<ChatSession> findByAgentIdOrderByCreatedAtDesc(Long agentId);
    List<ChatSession> findAllByOrderByCreatedAtDesc();
}
