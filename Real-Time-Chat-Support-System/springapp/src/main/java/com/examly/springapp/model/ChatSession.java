package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;
    private Long agentId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private Status status = Status.WAITING;

    private Integer satisfactionRating;
    private String feedbackComments;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum Status { ACTIVE, WAITING, CLOSED }
}
