package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "agent_availability")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgentAvailability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long availabilityId;

    private Long agentId;

    @Enumerated(EnumType.STRING)
    private Status status;

    private Integer maxConcurrentChats;
    private Integer currentChatCount;

    public enum Status { AVAILABLE, BUSY, OFFLINE, BREAK }

    public boolean canTakeMoreChats() {
        return status == Status.AVAILABLE && currentChatCount < maxConcurrentChats;
    }
}
