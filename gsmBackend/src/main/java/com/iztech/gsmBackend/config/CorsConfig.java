package com.iztech.gsmBackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns(
                            "https://ceng-316.vercel.app",
                            "https://ceng316-production.up.railway.app",
                            "http://localhost:3000"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With")
                        .exposedHeaders("Content-Disposition", "Authorization")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}
