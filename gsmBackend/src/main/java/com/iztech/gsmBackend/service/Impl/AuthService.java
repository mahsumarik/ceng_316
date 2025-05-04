package com.iztech.gsmBackend.service.Impl;

import com.iztech.gsmBackend.jwt.AuthRequest;
import com.iztech.gsmBackend.jwt.AuthResponse;
import com.iztech.gsmBackend.jwt.RegisterRequest;
import com.iztech.gsmBackend.enums.ROLE;
import com.iztech.gsmBackend.jwt.JwtService;
import com.iztech.gsmBackend.model.Student;
import com.iztech.gsmBackend.repository.StudentRepository;
import com.iztech.gsmBackend.service.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public String register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        Student student = Student.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(ROLE.STUDENT)
                .build();

        studentRepository.save(student);
        return "Student registered successfully";
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        Student student = studentRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        User userDetails = new User(student.getEmail(), student.getPassword(),
                java.util.List.of(() -> "ROLE_" + student.getRole().name()));

        String jwt = jwtService.generateToken(userDetails, student.getRole().name(),student.getFirstName());
        return new AuthResponse(jwt, student.getRole().name());
    }

    @Override
    public String logout() {
        return "Logout successful on client-side";
    }
}