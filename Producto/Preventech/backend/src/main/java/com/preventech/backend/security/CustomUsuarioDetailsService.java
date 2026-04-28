package com.preventech.backend.security;

import com.preventech.backend.entities.Usuario;
import com.preventech.backend.repositories.UsuarioRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Primary
public class CustomUsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepo;

    public CustomUsuarioDetailsService(UsuarioRepository usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

        var authorities = List.of(new SimpleGrantedAuthority("ROLE_USUARIO"));

        return new org.springframework.security.core.userdetails.User(
                usuario.getEmail(),       
                usuario.getPassword(),   
                true,                     
                true,                  
                true,                   
                true,                   
                authorities
        );
    }
}
