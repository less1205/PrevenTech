package com.preventech.backend.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.preventech.backend.entities.Alerta;
import com.preventech.backend.repositories.AlertaRepository;

@Service
public class AlertaServiceImpl implements AlertaService {

    @Autowired
    private AlertaRepository alertaRepository;

    @Override
    public Alerta crear(Alerta alerta) {
        return alertaRepository.save(alerta);
    }

    @Override
    public Alerta obtenerId(Long id) {
        return alertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerta no encontrada con id: " + id));
    }

    @Override
    public List<Alerta> listarTodos() {
        return (List<Alerta>) alertaRepository.findAll();
    }

    @Override
    public void eliminar(Long id) {
        if (!alertaRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar: Alerta no encontrada");
        }
        alertaRepository.deleteById(id);
    }

    @Override
    public Alerta actualizar(Long id, Alerta alertaActualizada) {
        Alerta existente = obtenerId(id);

        if (alertaActualizada.getColor() != null) {
            existente.setColor(alertaActualizada.getColor());
        }
        
        if (alertaActualizada.getMensaje() != null) {
            existente.setMensaje(alertaActualizada.getMensaje());
        }

        return alertaRepository.save(existente);
    }
}