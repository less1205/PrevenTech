package com.preventech.backend.services;

import java.util.List;
import com.preventech.backend.entities.Alerta;

public interface AlertaService {
    Alerta crear(Alerta alerta);
    Alerta obtenerId(Long id);
    List<Alerta> listarTodos();
    void eliminar(Long id);
    Alerta actualizar(Long id, Alerta alertaActualizada);
}