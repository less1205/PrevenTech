package com.preventech.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.preventech.backend.entities.Equipo;
import com.preventech.backend.repositories.EquipoRepository;

@Service
public class EquipoServiceImpl implements EquipoService {

    @Autowired
    private EquipoRepository equipoRepository;

    @Override
    public Equipo crear(Equipo equipo) {
        return equipoRepository.save(equipo);
    }

    @Override
    public Equipo obtenerId(Long id) {
        return equipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
    }

    @Override
    public List<Equipo> listarTodos() {
        return (List<Equipo>) equipoRepository.findAll();
    }

    @Override
    public void eliminar(Long id) {

        if (!equipoRepository.existsById(id)) {
            throw new RuntimeException("Equipo no encontrado");
        }

        equipoRepository.deleteById(id);
    }

    @Override
    public Equipo actualizar(Long id, Equipo equipoActualizado) {

        Equipo existente = obtenerId(id);

        if (equipoActualizado.getNombre() != null) {
            existente.setNombre(equipoActualizado.getNombre());
        }

        if (equipoActualizado.getTipo() != null) {
            existente.setTipo(equipoActualizado.getTipo());
        }

        if (equipoActualizado.getUbicacion() != null) {
            existente.setUbicacion(equipoActualizado.getUbicacion());
        }

        if (equipoActualizado.getEstado() != null) {
            existente.setEstado(equipoActualizado.getEstado());
        }

        return equipoRepository.save(existente);
    }
}