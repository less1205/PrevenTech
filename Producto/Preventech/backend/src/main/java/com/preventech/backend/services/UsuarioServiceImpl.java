package com.preventech.backend.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.preventech.backend.entities.Usuario;
import com.preventech.backend.repositories.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Usuario crear(Usuario usuario) {

        if (usuario.getPassword() != null) {
            String hashed = passwordEncoder.encode(usuario.getPassword());
            usuario.setPassword(hashed);
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
        return (List<Usuario>) usuarioRepository.findAll();
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

        if (usuarioActualizado.getNombre() != null) {
            existente.setNombre(usuarioActualizado.getNombre());
        }
        if (usuarioActualizado.getEmail() != null) {
            existente.setEmail(usuarioActualizado.getEmail());
        }
        if (usuarioActualizado.getPassword() != null) {
            String hashed = passwordEncoder.encode(usuarioActualizado.getPassword());
            existente.setPassword(hashed);
        }

        return usuarioRepository.save(existente);
    }
}
