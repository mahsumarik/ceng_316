package com.iztech.gsmBackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@CrossOrigin(origins = "*")
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("https://ceng-316.vercel.app")   // React dev sunucusu
                        .allowedMethods("*") // Tüm HTTP metodlarının (GET, POST, PUT, DELETE vb.) izinli olduğunu belirtir.
                        .allowedHeaders("*") // Tüm HTTP başlıklarının izinli olduğunu belirtir.
                        .allowCredentials(true); // Tarayıcıdan gelen isteklerin kimlik doğrulama bilgilerini (örneğin, çerez veya JWT) göndermesine izin verir.
            }
        };
    }
}
