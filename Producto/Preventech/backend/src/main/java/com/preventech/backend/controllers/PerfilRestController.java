package com.preventech.backend.controllers;

import com.preventech.backend.entities.Usuario;
import com.preventech.backend.repositories.UsuarioRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/perfil")
@CrossOrigin(origins = "http://localhost:5173")
public class PerfilRestController {

    private final JavaMailSender mailSender;
    private final UsuarioRepository usuarioRepository;

    @Value("${app.mail.admin}")
    private String adminEmail;

    public PerfilRestController(
            JavaMailSender mailSender,
            UsuarioRepository usuarioRepository
    ) {
        this.mailSender = mailSender;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/solicitud")
    public ResponseEntity<?> solicitarCambio(
            @RequestBody Map<String, String> body,
            Authentication authentication
    ) {

        try {

            String emailUsuario = authentication.getName();

            Usuario usuario = usuarioRepository
                    .findByEmail(emailUsuario)
                    .orElseThrow(() ->
                            new RuntimeException("Usuario no encontrado"));

            String tipo = body.get("tipo");

            String mensaje = "";

            if ("CORREO".equals(tipo)) {

                String nuevoCorreo = body.get("nuevoCorreo");

                mensaje =
                        "Solicitud de cambio de correo\n\n"
                        + "Usuario: " + usuario.getNombre() + "\n"
                        + "Correo actual: " + usuario.getEmail() + "\n"
                        + "Nuevo correo solicitado: " + nuevoCorreo;
            }

            if ("PASSWORD".equals(tipo)) {

                mensaje =
                        "Solicitud de cambio de contraseña\n\n"
                        + "Usuario: " + usuario.getNombre() + "\n"
                        + "Correo: " + usuario.getEmail();
            }

            SimpleMailMessage mail = new SimpleMailMessage();

            mail.setTo(adminEmail);
            mail.setSubject("Solicitud de cambio de cuenta - PrevenTech");
            mail.setText(mensaje);

            mailSender.send(mail);

            return ResponseEntity.ok(
                    Map.of(
                            "mensaje",
                            "Solicitud enviada correctamente"
                    )
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }
}