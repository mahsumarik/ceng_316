package com.iztech.gsmBackend.config;

import com.iztech.gsmBackend.model.User;
import com.iztech.gsmBackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.iztech.gsmBackend.repository.ISecretaryRepository;

@Configuration
@RequiredArgsConstructor
public class AppConfig {

    @Autowired
    private IStudentRepository studentRepository;
    @Autowired
    private IAdvisorRepository advisorRepository;
    @Autowired
    private ISecretaryRepository secretaryRepository;
    @Autowired
    private IStudentAffairRepository studentAffairRepository;
    @Autowired
    private IDeanRepository deanRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return email -> {
            User user = findUserByEmail(email);
            if (user == null) {
                throw new UsernameNotFoundException("User not found");
            }
            return org.springframework.security.core.userdetails.User.builder()
                    .username(user.getEmail())
                    .password(user.getPassword())
                    .authorities("ROLE_" + user.getRole().name())
                    .build();
        };
    }

    private User findUserByEmail(String email) {
        User user = studentRepository.findByEmail(email).orElse(null);
        if (user != null) return user;

        user = advisorRepository.findByEmail(email).orElse(null);
        if (user != null) return user;

        user = deanRepository.findByEmail(email).orElse(null);
        if (user != null) return user;

        user = secretaryRepository.findByEmail(email).orElse(null);
        if (user != null) return user;

        return studentAffairRepository.findByEmail(email).orElse(null);
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}