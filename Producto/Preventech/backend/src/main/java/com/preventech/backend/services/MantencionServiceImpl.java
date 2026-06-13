package com.preventech.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.preventech.backend.entities.Mantencion;
import com.preventech.backend.repositories.MantencionRepository;

@Service
public class MantencionServiceImpl implements MantencionService {

    private final MantencionRepository mantencionRepository;

    MantencionServiceImpl(MantencionRepository mantencionRepository) {
        this.mantencionRepository = mantencionRepository;
    }

    @Override
    public Mantencion crear(Mantencion mantencion) {
        return mantencionRepository.save(mantencion);
    }

    @Override
    public Mantencion obtenerId(Long id) {
        return mantencionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mantención no encontrada"));
    }

    @Override
    public List<Mantencion> listarTodos() {
        return (List<Mantencion>) mantencionRepository.findAll();
    }

    @Override
    public void eliminar(Long id) {

        if (!mantencionRepository.existsById(id)) {
            throw new RuntimeException("Mantención no encontrada");
        }

        mantencionRepository.deleteById(id);
    }

    @Override
    public Mantencion actualizar(Long id, Mantencion mantencionActualizada) {

        Mantencion existente = obtenerId(id);

        if (mantencionActualizada.getFecha() != null) {
            existente.setFecha(mantencionActualizada.getFecha());
        }

        if (mantencionActualizada.getDetalle() != null) {
            existente.setDetalle(mantencionActualizada.getDetalle());
        }

        if (mantencionActualizada.getEvidenciaUrl() != null) {
            existente.setEvidenciaUrl(mantencionActualizada.getEvidenciaUrl());
        }

        if (mantencionActualizada.getProximaFecha() != null) {
            existente.setProximaFecha(mantencionActualizada.getProximaFecha());
        }

        if (mantencionActualizada.getEstado() != null) {
            existente.setEstado(mantencionActualizada.getEstado());
        }

        return mantencionRepository.save(existente);
    }
}