package com.preventech.backend.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.preventech.backend.enums.Tipo;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

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

    @JsonManagedReference
    @OneToMany(mappedBy = "equipo")
    private List<Mantencion> mantenciones;

}
