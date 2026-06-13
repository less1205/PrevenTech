package com.preventech.backend.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.preventech.backend.entities.Mantencion;
import com.preventech.backend.enums.Estado;
import com.preventech.backend.repositories.MantencionRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class MantencionServiceImplTest {

    @Mock
    private MantencionRepository mantencionRepository;

    @InjectMocks
    private MantencionServiceImpl mantencionServices;

    private Mantencion mantencion1;
    private Mantencion mantencion2;

    @BeforeEach
    public void setup() {
        mantencion1 = new Mantencion();
        mantencion1.setId(1L);
        mantencion1.setFecha(LocalDate.of(2025, 1, 10));
        mantencion1.setDetalle("Revisión general");
        mantencion1.setEvidenciaUrl("http://evidencia1.com");
        mantencion1.setProximaFecha(LocalDate.of(2025, 7, 10));
        mantencion1.setEstado(Estado.AL_DIA);

        mantencion2 = new Mantencion();
        mantencion2.setId(2L);
        mantencion2.setFecha(LocalDate.of(2025, 3, 5));
        mantencion2.setDetalle("Cambio de filtros");
        mantencion2.setEstado(Estado.PROXIMO);
    }

    @Test
    public void crear_debeRetornarMantencionGuardada() {
        when(mantencionRepository.save(any(Mantencion.class))).thenAnswer(inv -> {
            Mantencion m = inv.getArgument(0);
            m.setId(10L);
            return m;
        });

        Mantencion nueva = new Mantencion();
        nueva.setDetalle("Lubricación");
        nueva.setFecha(LocalDate.now());

        Mantencion creada = mantencionServices.crear(nueva);

        assertNotNull(creada);
        assertEquals(10L, creada.getId());
        assertEquals("Lubricación", creada.getDetalle());
        verify(mantencionRepository, times(1)).save(any(Mantencion.class));
    }

    @Test
    public void obtenerId_existente_debeRetornarMantencion() {
        when(mantencionRepository.findById(1L)).thenReturn(Optional.of(mantencion1));

        Mantencion resultado = mantencionServices.obtenerId(1L);

        assertNotNull(resultado);
        assertEquals("Revisión general", resultado.getDetalle());
        verify(mantencionRepository, times(1)).findById(1L);
    }

    @Test
    public void obtenerId_noExistente_debeLanzarRuntimeException() {
        when(mantencionRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> mantencionServices.obtenerId(99L));

        assertEquals("Mantención no encontrada", ex.getMessage());
        verify(mantencionRepository, times(1)).findById(99L);
    }

    @Test
    public void listarTodos_debeRetornarListaDeMantenciones() {
        when(mantencionRepository.findAll()).thenReturn(Arrays.asList(mantencion1, mantencion2));

        List<Mantencion> lista = mantencionServices.listarTodos();

        assertEquals(2, lista.size());
        verify(mantencionRepository, times(1)).findAll();
    }

    @Test
    public void eliminar_existente_debeEliminarSinError() {
        when(mantencionRepository.existsById(1L)).thenReturn(true);
        doNothing().when(mantencionRepository).deleteById(1L);

        assertDoesNotThrow(() -> mantencionServices.eliminar(1L));
        verify(mantencionRepository, times(1)).deleteById(1L);
    }

    @Test
    public void eliminar_noExistente_debeLanzarRuntimeException() {
        when(mantencionRepository.existsById(99L)).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> mantencionServices.eliminar(99L));

        assertEquals("Mantención no encontrada", ex.getMessage());
        verify(mantencionRepository, never()).deleteById(anyLong());
    }

    @Test
    public void actualizar_debeGuardarConCambiosDeDetalle() {
        when(mantencionRepository.findById(1L)).thenReturn(Optional.of(mantencion1));
        when(mantencionRepository.save(any(Mantencion.class))).thenAnswer(i -> i.getArgument(0));

        Mantencion cambios = new Mantencion();
        cambios.setDetalle("Revisión actualizada");

        Mantencion actualizada = mantencionServices.actualizar(1L, cambios);

        assertEquals("Revisión actualizada", actualizada.getDetalle());
        assertEquals(Estado.AL_DIA, actualizada.getEstado());
        verify(mantencionRepository, times(1)).save(any(Mantencion.class));
    }

    @Test
    public void actualizar_debeCambiarFechaYEstado() {
        when(mantencionRepository.findById(1L)).thenReturn(Optional.of(mantencion1));
        when(mantencionRepository.save(any(Mantencion.class))).thenAnswer(i -> i.getArgument(0));

        LocalDate nuevaFecha = LocalDate.of(2026, 1, 1);
        Mantencion cambios = new Mantencion();
        cambios.setFecha(nuevaFecha);
        cambios.setEstado(Estado.VENCIDO);

        Mantencion actualizada = mantencionServices.actualizar(1L, cambios);

        assertEquals(nuevaFecha, actualizada.getFecha());
        assertEquals(Estado.VENCIDO, actualizada.getEstado());
        assertEquals("Revisión general", actualizada.getDetalle());
        verify(mantencionRepository, times(1)).save(any(Mantencion.class));
    }

    @Test
    public void actualizar_debeActualizarProximaFechaYEvidencia() {
        when(mantencionRepository.findById(1L)).thenReturn(Optional.of(mantencion1));
        when(mantencionRepository.save(any(Mantencion.class))).thenAnswer(i -> i.getArgument(0));

        LocalDate proximaFecha = LocalDate.of(2026, 6, 1);
        Mantencion cambios = new Mantencion();
        cambios.setProximaFecha(proximaFecha);
        cambios.setEvidenciaUrl("http://nueva-evidencia.com");

        Mantencion actualizada = mantencionServices.actualizar(1L, cambios);

        assertEquals(proximaFecha, actualizada.getProximaFecha());
        assertEquals("http://nueva-evidencia.com", actualizada.getEvidenciaUrl());
        verify(mantencionRepository, times(1)).save(any(Mantencion.class));
    }

    @Test
    public void actualizar_noExistente_debeLanzarRuntimeException() {
        when(mantencionRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> mantencionServices.actualizar(99L, new Mantencion()));

        assertEquals("Mantención no encontrada", ex.getMessage());
        verify(mantencionRepository, never()).save(any(Mantencion.class));
    }
}