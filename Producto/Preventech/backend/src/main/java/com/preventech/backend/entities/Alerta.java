package com.preventech.backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.preventech.backend.enums.Color;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Color color;

    private String mensaje;

    private LocalDate fechaGenerada;

    private String tipo;

    @JsonBackReference("mantencion-alerta")
    @OneToOne
    @JoinColumn(name = "mantencion_id")
    private Mantencion mantencion;
}