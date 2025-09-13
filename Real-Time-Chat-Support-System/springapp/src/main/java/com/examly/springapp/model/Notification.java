package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    private Long userId;
    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private Boolean isRead;
    private LocalDateTime createdDate;

    public enum NotificationType { ASSIGNED, QUEUED, MESSAGE }
}
