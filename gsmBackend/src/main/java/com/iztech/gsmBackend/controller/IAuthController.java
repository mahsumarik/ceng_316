package com.iztech.gsmBackend.controller;

import com.iztech.gsmBackend.dto.AuthRequest;
import com.iztech.gsmBackend.dto.AuthResponse;
import com.iztech.gsmBackend.dto.ForgotPasswordRequest;
import com.iztech.gsmBackend.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

public interface IAuthController {
    ResponseEntity<?> register(@RequestBody RegisterRequest request);
    ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request);
    ResponseEntity<String> logout();
    ResponseEntity<String> forgotPassword(ForgotPasswordRequest request);  // DTO'yu kullan
}