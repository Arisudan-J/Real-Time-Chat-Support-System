package com.examly.springapp.service;

import com.examly.springapp.model.AgentAvailability;
import com.examly.springapp.repository.AgentAvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AgentService {
    @Autowired
    private AgentAvailabilityRepository agentAvailabilityRepository;

    public AgentAvailability setAvailability(Long agentId, AgentAvailability.Status status) {
        Optional<AgentAvailability> optional = agentAvailabilityRepository.findByAgentId(agentId);
        AgentAvailability availability = optional.orElse(new AgentAvailability());
        availability.setAgentId(agentId);
        availability.setStatus(status);
        if (availability.getMaxConcurrentChats() == null) availability.setMaxConcurrentChats(5);
        if (availability.getCurrentChatCount() == null) availability.setCurrentChatCount(0);
        return agentAvailabilityRepository.save(availability);
    }
}
