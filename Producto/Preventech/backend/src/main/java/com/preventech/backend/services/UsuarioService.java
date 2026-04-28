package com.preventech.backend.services;

import java.util.List;
import com.preventech.backend.entities.Usuario;

public interface UsuarioService {
    Usuario crear(Usuario usuario);
    Usuario obtenerId(Long id);
    List<Usuario> listarTodos();
    void eliminar(Long id);
    Usuario actualizar(Long id, Usuario usuarioActualizado);
}


