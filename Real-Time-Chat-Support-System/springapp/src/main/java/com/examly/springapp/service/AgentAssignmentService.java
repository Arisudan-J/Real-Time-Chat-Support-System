package com.examly.springapp.service;

import com.examly.springapp.model.AgentAvailability;
import com.examly.springapp.model.ChatSession;
import com.examly.springapp.model.SessionQueue;
import com.examly.springapp.model.Notification;
import com.examly.springapp.repository.AgentAvailabilityRepository;
import com.examly.springapp.repository.SessionQueueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class AgentAssignmentService {

    @Autowired
    private AgentAvailabilityRepository agentAvailabilityRepository;

    @Autowired
    private SessionQueueRepository sessionQueueRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SessionManagementService sessionManagementService; // <-- use SessionManagementService instead of ChatService

    public ChatSession assignAgentToSession(Long customerId) {
        List<AgentAvailability> agents = agentAvailabilityRepository.findAll();

        Optional<AgentAvailability> optionalAgent = agents.stream()
                .filter(AgentAvailability::canTakeMoreChats)
                .min(Comparator.comparingInt(AgentAvailability::getCurrentChatCount));

        if (optionalAgent.isPresent()) {
            AgentAvailability agent = optionalAgent.get();
            agent.setCurrentChatCount(agent.getCurrentChatCount() + 1);
            if (agent.getCurrentChatCount() >= agent.getMaxConcurrentChats()) {
                agent.setStatus(AgentAvailability.Status.BUSY);
            }
            agentAvailabilityRepository.save(agent);

            ChatSession session = sessionManagementService.createSession(customerId, agent.getAgentId());

            notificationService.sendNotification(customerId,
                    "You are now connected with agent " + agent.getAgentId(),
                    Notification.NotificationType.ASSIGNED);

            notificationService.sendNotification(agent.getAgentId(),
                    "New chat assigned with customer " + customerId,
                    Notification.NotificationType.ASSIGNED);

            return session;
        } else {
            enqueueCustomer(customerId, SessionQueue.Priority.NORMAL);
            notificationService.sendNotification(customerId,
                    "All agents are busy. You are added to the queue.",
                    Notification.NotificationType.QUEUED);
            return sessionManagementService.createSession(customerId, null);
        }
    }

    public void releaseAgent(Long agentId) {
        Optional<AgentAvailability> optionalAgent = agentAvailabilityRepository.findByAgentId(agentId);
        if (optionalAgent.isPresent()) {
            AgentAvailability agent = optionalAgent.get();
            int count = agent.getCurrentChatCount() - 1;
            agent.setCurrentChatCount(Math.max(0, count));
            if (agent.getStatus() == AgentAvailability.Status.BUSY && count < agent.getMaxConcurrentChats()) {
                agent.setStatus(AgentAvailability.Status.AVAILABLE);
            }
            agentAvailabilityRepository.save(agent);
        }
    }

    public SessionQueue enqueueCustomer(Long customerId, SessionQueue.Priority priority) {
        SessionQueue queue = SessionQueue.builder()
                .customerId(customerId)
                .queueTime(LocalDateTime.now())
                .priority(priority)
                .status(SessionQueue.Status.WAITING)
                .build();
        return sessionQueueRepository.save(queue);
    }

    public void assignQueuedSessions() {
        List<SessionQueue> waitingQueue = sessionQueueRepository.findByStatusOrderByPriorityDescQueueTimeAsc(SessionQueue.Status.WAITING);
        for (SessionQueue queued : waitingQueue) {
            ChatSession session = assignAgentToSession(queued.getCustomerId());
            if (session.getAgentId() != null) {
                queued.setStatus(SessionQueue.Status.ASSIGNED);
                sessionQueueRepository.save(queued);
            } else {
                break;
            }
        }
    }
}
