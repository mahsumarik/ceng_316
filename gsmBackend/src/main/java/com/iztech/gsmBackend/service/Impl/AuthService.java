package com.iztech.gsmBackend.service.Impl;

import com.iztech.gsmBackend.dto.AuthRequest;
import com.iztech.gsmBackend.dto.AuthResponse;
import com.iztech.gsmBackend.dto.RegisterRequest;
import com.iztech.gsmBackend.jwt.JwtService;
import com.iztech.gsmBackend.model.*;
import com.iztech.gsmBackend.model.User;
import com.iztech.gsmBackend.repository.IStudentRepository;
import com.iztech.gsmBackend.repository.IAdvisorRepository;
import com.iztech.gsmBackend.repository.IDeanRepository;
import com.iztech.gsmBackend.repository.ISecretaryRepository;
import com.iztech.gsmBackend.repository.IStudentAffairRepository;
import com.iztech.gsmBackend.service.IAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService implements IAuthService {

    @Autowired
    private IStudentRepository studentRepository;
    @Autowired
    private IAdvisorRepository advisorRepository;
    @Autowired
    private IDeanRepository deanRepository;
    @Autowired
    private ISecretaryRepository secretaryRepository;
    @Autowired
    private IStudentAffairRepository studentAffairRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private JavaMailSender mailSender;

    // Register metodu
    @Override
    public String register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        // Veritabanında email kontrolü
        Optional<User> existingUserOpt = findUserByEmail(request.getEmail());
        if (!existingUserOpt.isPresent()) {
            throw new RuntimeException("User not found in database. Register operation is not allowed.");
        }

        // Kullanıcı varsa, şifreyi güncelle
        User existingUser = existingUserOpt.get();
        existingUser.setPassword(passwordEncoder.encode(request.getPassword())); // Şifreyi güncelle
        if (existingUser instanceof Student) {
            studentRepository.save((Student) existingUser);
        } else if (existingUser instanceof Advisor) {
            advisorRepository.save((Advisor) existingUser);
        } else if (existingUser instanceof Dean) {
            deanRepository.save((Dean) existingUser);
        } else if (existingUser instanceof Secretary) {
            secretaryRepository.save((Secretary) existingUser);
        } else if (existingUser instanceof StudentAffair) {
            studentAffairRepository.save((StudentAffair) existingUser);
        }
        return "User password updated successfully";
    }

    // Login metodu
    @Override
    public AuthResponse login(AuthRequest request) {
        // Giriş için authentication işlemi
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Kullanıcıyı email ile veritabanında bul
        User user = findUserByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Kullanıcı bilgilerini alarak JWT token oluşturuluyor
        org.springframework.security.core.userdetails.User userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(),
                java.util.Collections.singletonList(() -> "ROLE_" + user.getRole().name()) // Role bilgisi alınır
        );

        // JWT Token oluşturuluyor
        String jwt = jwtService.generateToken(userDetails, user.getRole().name(), user.getFirstName());
        return new AuthResponse(jwt, user.getRole().name());
    }

    // Logout metodu
    @Override
    public String logout() {
        return "Logout successful on client-side";
    }

    // Forgot password işlemi
    @Override
    public String forgotPassword(String email) {
        Optional<User> userOpt = findUserByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("No user found with that email");
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

    // Reset password işlemi
    @Override
    public String resetPassword(String email, String newPassword) {
        Optional<User> userOpt = findUserByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("No user found with that email");
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));

        // User türüne göre doğru repository ile kaydediyoruz
        if (user instanceof Student) {
            studentRepository.save((Student) user);
        } else if (user instanceof Advisor) {
            advisorRepository.save((Advisor) user);
        } else if (user instanceof Dean) {
            deanRepository.save((Dean) user);
        } else if (user instanceof Secretary) {
            secretaryRepository.save((Secretary) user);
        } else if (user instanceof StudentAffair) {
            studentAffairRepository.save((StudentAffair) user);
        }

        return "Password has been updated successfully.";
    }

    // Kullanıcıyı email ile bulmak için metod
    private Optional<User> findUserByEmail(String email) {
        Optional<User> user = studentRepository.findByEmail(email).map(u -> (User) u);
        if (user.isPresent()) return user;

        user = advisorRepository.findByEmail(email).map(u -> (User) u);
        if (user.isPresent()) return user;

        user = deanRepository.findByEmail(email).map(u -> (User) u);
        if (user.isPresent()) return user;

        user = secretaryRepository.findByEmail(email).map(u -> (User) u);
        if (user.isPresent()) return user;

        return studentAffairRepository.findByEmail(email).map(u -> (User) u);
    }
}
