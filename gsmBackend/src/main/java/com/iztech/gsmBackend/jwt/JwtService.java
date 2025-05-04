package com.iztech.gsmBackend.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtService {
    public static final String SECRET_KEY = "zV0UFbOn4yi4x9DQzcwLAibjG0jl+UZa65Isv/B2LSw=";

    public String generateToken(UserDetails userDetails, String role,String firstName) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("role", role)
                .claim("firstName", firstName)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 2))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public <T> T exportToken(String token, Function<Claims, T> claimsTFunction) {
        Claims claims = Jwts
                .parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claimsTFunction.apply(claims);
    }

    public String getUsernameByToken(String token) {
        return exportToken(token, Claims::getSubject);
    }

    public String getRoleByToken(String token) {
        return exportToken(token, claims -> claims.get("role", String.class));
    }

    public boolean isTokenExpired(String token) {
        Date expirationDate = exportToken(token, Claims::getExpiration);
        return new Date().after(expirationDate);
    }

    public Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}