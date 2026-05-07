package com.preventech.backend.services;

import java.util.List;

import com.preventech.backend.entities.Mantencion;

public interface MantencionService {

    Mantencion crear(Mantencion mantencion);
    Mantencion obtenerId(Long id);
    List<Mantencion> listarTodos();
    void eliminar(Long id);
    Mantencion actualizar(Long id, Mantencion mantencionActualizada);
}
