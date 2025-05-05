package com.iztech.gsmBackend.service;

import com.iztech.gsmBackend.dto.AuthRequest;
import com.iztech.gsmBackend.dto.AuthResponse;
import com.iztech.gsmBackend.dto.RegisterRequest;

public interface IAuthService {
    String register(RegisterRequest request);
    AuthResponse login(AuthRequest request);
    String logout();

    String forgotPassword(String email);

    String resetPassword(String email, String newPassword);
}