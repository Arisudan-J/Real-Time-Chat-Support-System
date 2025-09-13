package com.examly.springapp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examly.springapp.model.AgentAvailability;

public interface AgentAvailabilityRepository extends JpaRepository<AgentAvailability, Long> {
    Optional<AgentAvailability> findByAgentId(Long agentId);
}
