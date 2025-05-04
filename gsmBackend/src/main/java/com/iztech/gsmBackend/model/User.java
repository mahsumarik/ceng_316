package com.iztech.gsmBackend.model;

import com.iztech.gsmBackend.enums.ROLE;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)  // Name (firstName, lastName) null olamaz
    private String firstName;

    @Column(nullable = false)  // Surname (lastName) null olamaz
    private String lastName;

    @Column(nullable = false, unique = true)  // Email null olamaz ve unique olmalı
    private String email;

    @Column(nullable = false)  // Password null olamaz
    private String password;

    @Column(nullable = true)  // Phone null olabilir
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)  // Role null olamaz
    private ROLE role;
}

