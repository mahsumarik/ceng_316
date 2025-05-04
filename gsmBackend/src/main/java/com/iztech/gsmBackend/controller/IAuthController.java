package com.iztech.gsmBackend.controller;

import com.iztech.gsmBackend.jwt.AuthRequest;
import com.iztech.gsmBackend.jwt.AuthResponse;
import com.iztech.gsmBackend.jwt.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

public interface IAuthController {
    ResponseEntity<?> register(@RequestBody RegisterRequest request);
    ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request);
    ResponseEntity<String> logout();
}