package com.preventech.backend.repositories;

import org.springframework.data.repository.CrudRepository;

import com.preventech.backend.entities.Usuario;

public interface UsuarioRepository extends CrudRepository<Usuario, Long> {

}
