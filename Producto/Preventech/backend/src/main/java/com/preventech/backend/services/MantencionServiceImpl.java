package com.preventech.backend.services;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;

import com.preventech.backend.entities.Equipo;
import com.preventech.backend.entities.Mantencion;
import com.preventech.backend.enums.Estado;
import com.preventech.backend.repositories.EquipoRepository;
import com.preventech.backend.repositories.MantencionRepository;

@Service
public class MantencionServiceImpl implements MantencionService {

private final MantencionRepository mantencionRepository;
private final EquipoRepository equipoRepository;

MantencionServiceImpl(
        MantencionRepository mantencionRepository,
        EquipoRepository equipoRepository) {

    this.mantencionRepository = mantencionRepository;
    this.equipoRepository = equipoRepository;
}

@Override
public Mantencion crear(Mantencion mantencion) {

    LocalDate hoy = LocalDate.now();

    if (mantencion.getFecha() == null) {
        throw new RuntimeException("La fecha de mantención es obligatoria");
    }

    if (mantencion.getProximaFecha() == null) {
        throw new RuntimeException("La próxima fecha es obligatoria");
    }

    if (mantencion.getFecha().isAfter(hoy)) {
        throw new RuntimeException(
                "La fecha de mantención no puede ser futura");
    }

    if (!mantencion.getProximaFecha().isAfter(mantencion.getFecha())) {
        throw new RuntimeException(
                "La próxima fecha debe ser posterior a la fecha de mantención");
    }

    long diasRestantes =
            ChronoUnit.DAYS.between(hoy, mantencion.getProximaFecha());

    if (diasRestantes < 0) {
        mantencion.setEstado(Estado.VENCIDO);
    } else if (diasRestantes <= 30) {
        mantencion.setEstado(Estado.PROXIMO);
    } else {
        mantencion.setEstado(Estado.AL_DIA);
    }

    Mantencion saved = mantencionRepository.save(mantencion);

    actualizarEstadoEquipo(saved.getEquipo());

    return saved;
}

@Override
public Mantencion obtenerId(Long id) {

    return mantencionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Mantención no encontrada"));
}

@Override
public List<Mantencion> listarTodos() {

    return mantencionRepository.findAllWithRelations();
}

@Override
public void eliminar(Long id) {

    Mantencion mantencion = obtenerId(id);

    Equipo equipo = mantencion.getEquipo();

    mantencionRepository.deleteById(id);

    actualizarEstadoEquipo(equipo);
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

    LocalDate hoy = LocalDate.now();

    if (existente.getFecha().isAfter(hoy)) {
        throw new RuntimeException(
                "La fecha de mantención no puede ser futura");
    }

    if (!existente.getProximaFecha().isAfter(existente.getFecha())) {
        throw new RuntimeException(
                "La próxima fecha debe ser posterior a la fecha de mantención");
    }

    long diasRestantes =
            ChronoUnit.DAYS.between(hoy, existente.getProximaFecha());

    if (diasRestantes < 0) {
        existente.setEstado(Estado.VENCIDO);
    } else if (diasRestantes <= 30) {
        existente.setEstado(Estado.PROXIMO);
    } else {
        existente.setEstado(Estado.AL_DIA);
    }

    Mantencion saved = mantencionRepository.save(existente);

    actualizarEstadoEquipo(saved.getEquipo());

    return saved;
}

@Override
public Mantencion resolver(Long id) {

    Mantencion existente = obtenerId(id);

    existente.setEstado(Estado.AL_DIA);

    Mantencion saved = mantencionRepository.save(existente);

    actualizarEstadoEquipo(saved.getEquipo());

    return saved;
}

private void actualizarEstadoEquipo(Equipo equipo) {

    if (equipo == null) {
        return;
    }

    Equipo equipoDb = equipoRepository.findById(equipo.getId())
            .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

    List<Mantencion> mantenciones =
            mantencionRepository.findByEquipoId(equipoDb.getId());

    String nuevoEstado = "AL_DIA";

    for (Mantencion m : mantenciones) {

        if (m.getEstado() == Estado.VENCIDO) {
            nuevoEstado = "VENCIDO";
            break;
        }

        if (m.getEstado() == Estado.PROXIMO) {
            nuevoEstado = "PROXIMO";
        }
    }

    equipoDb.setEstado(nuevoEstado);

    equipoRepository.save(equipoDb);
    }
}