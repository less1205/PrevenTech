package com.preventech.backend.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.preventech.backend.entities.Alerta;
import com.preventech.backend.services.AlertaService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/Alerta")
public class AlertaRestController {

    @Autowired
    private AlertaService alertaService;

    @PostMapping
    public ResponseEntity<Alerta> crear(@RequestBody Alerta alerta) {
        return ResponseEntity.ok(alertaService.crear(alerta));
    }

    @GetMapping
    public ResponseEntity<List<Alerta>> listar() {
        return ResponseEntity.ok(alertaService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alerta> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(alertaService.obtenerId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Alerta> actualizar(@PathVariable Long id, @RequestBody Alerta alerta) {
        return ResponseEntity.ok(alertaService.actualizar(id, alerta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        alertaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}