package com.preventech.backend.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.preventech.backend.enums.Rol;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Debe ingresar un nombre")
    private String nombre;

    @NotBlank(message = "Debe ingresar un correo electrónico")
    @Column(unique = true)
    @Pattern(
        regexp = "^[A-Za-z0-9._%+-]+@gmail\\.com$",
        message = "El correo debe ser una dirección @gmail.com"
    )
    private String email;

    @NotBlank(message = "Debe ingresar una contraseña")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\\\"\\\\|,.<>/?]).{8,}$",
        message = "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
    )
    private String password;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    @JsonIgnoreProperties("usuario")
    @OneToMany(
        mappedBy = "usuario",
        fetch = FetchType.LAZY
    )
    @JsonIgnore
    private List<Mantencion> mantenciones;
}