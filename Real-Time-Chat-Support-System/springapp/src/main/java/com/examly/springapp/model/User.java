package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.CUSTOMER;

    private String phone;
    private String department;

    @Enumerated(EnumType.STRING)
    private Status status = Status.OFFLINE;

    public enum Role { CUSTOMER, AGENT, SUPERVISOR, ADMIN }
    public enum Status { ONLINE, OFFLINE, BUSY, AWAY }
}
