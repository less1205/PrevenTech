package com.preventech.backend.services;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.preventech.backend.entities.Usuario;
import com.preventech.backend.repositories.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Usuario crear(Usuario usuario) {

        usuario.setEmail(usuario.getEmail().toLowerCase());

        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("El correo ya está registrado");
        }

        if (usuario.getPassword() != null && !usuario.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }

        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario obtenerId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Override
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    public void eliminar(Long id) {

        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }

        usuarioRepository.deleteById(id);
    }

    @Override
    public Usuario actualizar(Long id, Usuario usuarioActualizado) {

        Usuario existente = obtenerId(id);

        if (usuarioActualizado.getNombre() != null &&
                !usuarioActualizado.getNombre().isBlank()) {
            existente.setNombre(usuarioActualizado.getNombre());
        }

        if (usuarioActualizado.getEmail() != null &&
                !usuarioActualizado.getEmail().isBlank()) {

            String nuevoEmail = usuarioActualizado.getEmail().toLowerCase();

            if (!existente.getEmail().equals(nuevoEmail) &&
                    usuarioRepository.existsByEmail(nuevoEmail)) {
                throw new RuntimeException("El correo ya está registrado");
            }

            existente.setEmail(nuevoEmail);
        }

        if (usuarioActualizado.getPassword() != null &&
                !usuarioActualizado.getPassword().isBlank()) {
            existente.setPassword(passwordEncoder.encode(usuarioActualizado.getPassword()));
        }

        return usuarioRepository.save(existente);
    }
}