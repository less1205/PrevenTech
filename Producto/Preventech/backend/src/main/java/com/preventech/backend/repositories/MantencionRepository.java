package com.preventech.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.preventech.backend.entities.Mantencion;

public interface MantencionRepository extends CrudRepository<Mantencion, Long> {

    @Query("""
        SELECT DISTINCT m
        FROM Mantencion m
        LEFT JOIN FETCH m.alerta
        LEFT JOIN FETCH m.equipo
        LEFT JOIN FETCH m.usuario
    """)
    List<Mantencion> findAllWithRelations();

    List<Mantencion> findByEquipoId(Long equipoId);
}