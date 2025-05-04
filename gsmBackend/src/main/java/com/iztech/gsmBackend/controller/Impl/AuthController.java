package com.iztech.gsmBackend.controller.Impl;

import com.iztech.gsmBackend.controller.IAuthController;
import com.iztech.gsmBackend.jwt.AuthRequest;
import com.iztech.gsmBackend.jwt.AuthResponse;
import com.iztech.gsmBackend.jwt.RegisterRequest;
import com.iztech.gsmBackend.service.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController implements IAuthController {

    private final IAuthService authService;

    @PostMapping("/register")
    @Override
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
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
}