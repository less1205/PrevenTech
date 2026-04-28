package com.preventech.backend.repositories;

import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

import com.preventech.backend.entities.Usuario;

public interface UsuarioRepository extends CrudRepository<Usuario, Long> { 
    Optional<Usuario> findByEmail(String email);
}
