package com.preventech.backend.entities;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @ManyToOne
    @JoinColumn(name = "equipo_id")
    @JsonIgnoreProperties("mantenciones")
    private Equipo equipo;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @JsonIgnoreProperties("mantenciones") // CORREGIDO: Cambiado de JsonBackReference a JsonIgnoreProperties
    private Usuario usuario;

    @OneToOne(mappedBy = "mantencion", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("mantencion-alerta")
    private Alerta alerta;
}