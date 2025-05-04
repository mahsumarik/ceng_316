package com.iztech.gsmBackend.jwt;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}