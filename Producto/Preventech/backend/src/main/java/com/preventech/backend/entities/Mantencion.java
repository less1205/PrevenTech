package com.preventech.backend.entities;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

import com.preventech.backend.enums.Estado;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor

@Data

@Entity
public class Mantencion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;

    private String detalle;

    @Column(name = "evidencia_url")
    private String evidenciaUrl;

    private LocalDate proximaFecha;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "equipo_id")
    private Equipo equipo;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}