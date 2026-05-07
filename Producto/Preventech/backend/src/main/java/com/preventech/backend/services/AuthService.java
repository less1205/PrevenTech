package com.preventech.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.preventech.backend.entities.Usuario;
import com.preventech.backend.security.JwtService;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    public String login(Usuario usuario) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        usuario.getEmail(),
                        usuario.getPassword()
                )
        );

        if (authentication.isAuthenticated()) {
            return jwtService.generarToken(usuario.getEmail());
        }

        throw new RuntimeException("Credenciales inválidas");
    }
}