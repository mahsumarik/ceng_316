package com.iztech.gsmBackend.service;

import com.iztech.gsmBackend.jwt.AuthRequest;
import com.iztech.gsmBackend.jwt.AuthResponse;
import com.iztech.gsmBackend.jwt.RegisterRequest;

public interface IAuthService {
    String register(RegisterRequest request);
    AuthResponse login(AuthRequest request);
    String logout();
}