package com.iztech.gsmBackend.controller.Impl;

import com.iztech.gsmBackend.controller.IAuthController;
import com.iztech.gsmBackend.dto.*;
import com.iztech.gsmBackend.service.IAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")

public class AuthController implements IAuthController {

    @Autowired
    private  IAuthService authService;

    @PostMapping("/register")
    @Override
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    @Override
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    @Override
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok(authService.logout());
    }

    // AuthController.java
    @PostMapping("/forgot-password")
    @Override
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request.getEmail()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request.getEmail(), request.getNewPassword()));
    }

}