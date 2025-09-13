package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "session_queue")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionQueue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long queueId;

    private Long customerId;
    private LocalDateTime queueTime;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status { WAITING, ASSIGNED, CANCELLED }
    public enum Priority { LOW, NORMAL, HIGH, URGENT }
}
