package com.preventech.backend.controllers;

import com.preventech.backend.entities.Usuario;
import com.preventech.backend.repositories.UsuarioRepository;
import com.preventech.backend.security.JwtService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthRestController {

    private final UsuarioRepository usuarioRepo;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthRestController(UsuarioRepository usuarioRepo,
                          JwtService jwtService,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepo = usuarioRepo;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario request) {

        Usuario usuario = usuarioRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }

        String token = jwtService.generarToken(usuario.getEmail());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", usuario.getEmail(),
                "rol", usuario.getRol()
        ));
    }
}