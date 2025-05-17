package com.iztech.gsmBackend.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;
    private String confirmPassword;
    private String role;
}