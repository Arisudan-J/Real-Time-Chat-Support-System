package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long sessionId;
    private Long senderId;
    private Long receiverId;

    @Column(nullable = false, length = 1000)
    private String content;

    private LocalDateTime timestamp;
    private Boolean isRead = false;
    private Boolean delivered = true;

    @Enumerated(EnumType.STRING)
    private MessageType messageType = MessageType.TEXT;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }

    public enum MessageType { TEXT, FILE, IMAGE, SYSTEM }
}
