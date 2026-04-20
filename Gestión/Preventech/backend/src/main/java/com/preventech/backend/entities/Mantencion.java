package com.preventech.backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor

@Entity
public class Mantencion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

}
