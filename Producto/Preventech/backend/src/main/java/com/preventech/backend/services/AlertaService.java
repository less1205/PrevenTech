package com.preventech.backend.services;

import java.util.List;
import com.preventech.backend.entities.Alerta;

public interface AlertaService {
    Alerta crear(Alerta alerta);
    Alerta obtenerId(Long id);
    List<Alerta> listarTodos();
    List<Alerta> listarRecientes();
    void eliminar(Long id);
    Alerta actualizar(Long id, Alerta alertaActualizada);
    void generarAlertasDesdeMantencion();
}