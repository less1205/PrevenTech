package com.preventech.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.preventech.backend.entities.Alerta;
import com.preventech.backend.enums.Color;

public interface AlertaRepository extends JpaRepository<Alerta, Long> {

    List<Alerta> findByColor(Color color);

    Optional<Alerta> findByMantencionId(Long mantencionId);

    List<Alerta> findTop3ByOrderByFechaGeneradaDescIdDesc();

    boolean existsByMantencionIdAndFechaGenerada(Long mantencionId, LocalDate fecha);

    @Query("SELECT a FROM Alerta a WHERE a.mantencion.id = :mantencionId AND a.fechaGenerada = :fecha")
    Optional<Alerta> findByMantencionIdAndFechaGenerada(@Param("mantencionId") Long mantencionId, @Param("fecha") LocalDate fecha);

    List<Alerta> findAllByOrderByFechaGeneradaDescIdDesc();
}