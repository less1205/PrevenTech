package com.preventech.backend.services;

import java.util.List;

import com.preventech.backend.entities.Equipo;

public interface EquipoService {

    Equipo crear(Equipo equipo);
    Equipo obtenerId(Long id);
    List<Equipo> listarTodos();
    void eliminar(Long id);
    Equipo actualizar(Long id, Equipo equipoActualizado);

}