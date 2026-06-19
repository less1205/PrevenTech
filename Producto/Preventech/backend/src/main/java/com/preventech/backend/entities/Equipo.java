package com.preventech.backend.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.preventech.backend.enums.Tipo;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;

    @Enumerated(EnumType.STRING)
    private Tipo tipo;
    private String ubicacion;
    private String estado;

    @OneToMany(
        mappedBy = "equipo",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    @JsonIgnore
    private List<Mantencion> mantenciones;
}