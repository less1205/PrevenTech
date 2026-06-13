package com.preventech.backend.controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.preventech.backend.entities.Mantencion;
import com.preventech.backend.services.MantencionService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/mantenciones")
public class MantencionRestController {

    private final MantencionService mantencionService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public MantencionRestController(MantencionService mantencionService) {
        this.mantencionService = mantencionService;
    }

    @PostMapping
    public ResponseEntity<Mantencion> crear(@RequestBody Mantencion mantencion) {
        return ResponseEntity.ok(mantencionService.crear(mantencion));
    }

    @GetMapping
    public ResponseEntity<List<Mantencion>> listar() {
        return ResponseEntity.ok(mantencionService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mantencion> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(mantencionService.obtenerId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mantencion> actualizar(@PathVariable Long id, @RequestBody Mantencion mantencion) {
        return ResponseEntity.ok(mantencionService.actualizar(id, mantencion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        mantencionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/evidencia")
    public ResponseEntity<Mantencion> subirEvidencia(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Path dir = Paths.get(uploadDir);
            if (!Files.exists(dir)) {
                Files.createDirectories(dir);
            }

            String extension = "";
            String original = file.getOriginalFilename();
            if (original != null && original.contains(".")) {
                extension = original.substring(original.lastIndexOf("."));
            }

            String nombreArchivo = UUID.randomUUID() + extension;
            Path destino = dir.resolve(nombreArchivo);
            Files.copy(file.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            String url = "/uploads/evidencias/" + nombreArchivo;

            Mantencion actualizada = new Mantencion();
            actualizada.setEvidenciaUrl(url);
            return ResponseEntity.ok(mantencionService.actualizar(id, actualizada));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}