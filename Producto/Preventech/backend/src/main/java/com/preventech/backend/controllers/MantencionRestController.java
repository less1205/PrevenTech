package com.preventech.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.preventech.backend.entities.Mantencion;
import com.preventech.backend.services.MantencionService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/Mantencion")
public class MantencionRestController {

    @Autowired
    private MantencionService mantencionService;

    @PostMapping
    public ResponseEntity<Mantencion> crear(
            @RequestBody Mantencion mantencion) {

        return ResponseEntity.ok(
                mantencionService.crear(mantencion)
        );
    }

    @GetMapping
    public ResponseEntity<List<Mantencion>> listar() {

        return ResponseEntity.ok(
                mantencionService.listarTodos()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mantencion> obtener(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                mantencionService.obtenerId(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mantencion> actualizar(
            @PathVariable Long id,
            @RequestBody Mantencion mantencion) {

        return ResponseEntity.ok(
                mantencionService.actualizar(id, mantencion)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id) {

        mantencionService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}