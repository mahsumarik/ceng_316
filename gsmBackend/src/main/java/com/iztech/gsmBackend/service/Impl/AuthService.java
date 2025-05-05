package com.iztech.gsmBackend.service.Impl;

import com.iztech.gsmBackend.dto.AuthRequest;
import com.iztech.gsmBackend.dto.AuthResponse;
import com.iztech.gsmBackend.dto.RegisterRequest;
import com.iztech.gsmBackend.enums.ROLE;
import com.iztech.gsmBackend.jwt.JwtService;
import com.iztech.gsmBackend.model.Student;
import com.iztech.gsmBackend.repository.StudentRepository;
import com.iztech.gsmBackend.service.IAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService implements IAuthService {

    @Autowired
    private  StudentRepository studentRepository;
    @Autowired
    private  PasswordEncoder passwordEncoder;
    @Autowired
    private  AuthenticationManager authenticationManager;
    @Autowired
    private  JwtService jwtService;
    @Autowired
    private  JavaMailSender mailSender;

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

    @Override
    public String forgotPassword(String email) {
        Optional<Student> studentOpt = studentRepository.findByEmail(email);
        if (studentOpt.isEmpty()) {
            throw new RuntimeException("No student found with that email");
        }

        try {
            String resetLink = "http://localhost:3000/reset-password?email=" + email;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Password Reset Request");
            message.setText("Click the link below to reset your password:\n\n" + resetLink);

            mailSender.send(message);
            return "Reset link has been sent to your email address";
        } catch (Exception e) {
            throw new RuntimeException("Failed to send reset email. Please try again later.");
        }
    }

    @Override
    public String resetPassword(String email, String newPassword) {
        Optional<Student> studentOpt = studentRepository.findByEmail(email);
        if (studentOpt.isEmpty()) {
            throw new RuntimeException("No student found with that email");
        }

        Student student = studentOpt.get();
        student.setPassword(passwordEncoder.encode(newPassword));
        studentRepository.save(student);

        return "Password has been updated successfully.";
    }
}