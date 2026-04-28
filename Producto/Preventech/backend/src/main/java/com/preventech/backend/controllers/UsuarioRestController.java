package com.preventech.backend.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.preventech.backend.entities.Usuario;
import com.preventech.backend.services.UsuarioService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/Usuario")
public class UsuarioRestController {

    @Autowired
    private UsuarioService UsuarioService;

    @PostMapping
    public ResponseEntity<Usuario> crear(@RequestBody Usuario Usuario) {
        return ResponseEntity.ok(UsuarioService.crear(Usuario));
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {
        return ResponseEntity.ok(UsuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(UsuarioService.obtenerId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @RequestBody Usuario Usuario) {
        return ResponseEntity.ok(UsuarioService.actualizar(id, Usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        UsuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
