package com.preventech.backend.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.preventech.backend.webconfig.JwtProperties;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Autowired
    private JwtProperties jwtProperties;

    public String generarToken(String email) {

        SecretKey key = Keys.hmacShaKeyFor(
                jwtProperties.getSecret().getBytes()
        );

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + jwtProperties.getExpiration()
                        )
                )
                .signWith(key)
                .compact();
    }
}