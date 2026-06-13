package com.preventech.backend.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.preventech.backend.entities.Equipo;
import com.preventech.backend.enums.Tipo;
import com.preventech.backend.repositories.EquipoRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class EquipoServiceImplTest {

    @Mock
    private EquipoRepository equipoRepository;

    @InjectMocks
    private EquipoServiceImpl equipoServices;

    private Equipo equipo1;
    private Equipo equipo2;

    @BeforeEach
    public void setup() {
        equipo1 = new Equipo();
        equipo1.setId(1L);
        equipo1.setNombre("Compresor A");
        equipo1.setTipo(Tipo.MECANICOS);
        equipo1.setUbicacion("Sala 1");
        equipo1.setEstado("ACTIVO");

        equipo2 = new Equipo();
        equipo2.setId(2L);
        equipo2.setNombre("Motor B");
        equipo2.setTipo(Tipo.ELECTRICOS);
        equipo2.setUbicacion("Sala 2");
        equipo2.setEstado("INACTIVO");
    }

    @Test
    public void crear_debeRetornarEquipoGuardado() {
        when(equipoRepository.save(any(Equipo.class))).thenAnswer(inv -> {
            Equipo e = inv.getArgument(0);
            e.setId(10L);
            return e;
        });

        Equipo nuevo = new Equipo();
        nuevo.setNombre("Bomba C");
        nuevo.setTipo(Tipo.ROTATIVOS);

        Equipo creado = equipoServices.crear(nuevo);

        assertNotNull(creado);
        assertEquals(10L, creado.getId());
        assertEquals("Bomba C", creado.getNombre());
        verify(equipoRepository, times(1)).save(any(Equipo.class));
    }

    @Test
    public void obtenerId_existente_debeRetornarEquipo() {
        when(equipoRepository.findById(1L)).thenReturn(Optional.of(equipo1));

        Equipo resultado = equipoServices.obtenerId(1L);

        assertNotNull(resultado);
        assertEquals("Compresor A", resultado.getNombre());
        verify(equipoRepository, times(1)).findById(1L);
    }

    @Test
    public void obtenerId_noExistente_debeLanzarRuntimeException() {
        when(equipoRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> equipoServices.obtenerId(99L));

        assertEquals("Equipo no encontrado", ex.getMessage());
        verify(equipoRepository, times(1)).findById(99L);
    }

    @Test
    public void listarTodos_debeRetornarListaDeEquipos() {
        when(equipoRepository.findAll()).thenReturn(Arrays.asList(equipo1, equipo2));

        List<Equipo> lista = equipoServices.listarTodos();

        assertEquals(2, lista.size());
        verify(equipoRepository, times(1)).findAll();
    }

    @Test
    public void eliminar_existente_debeEliminarSinError() {
        when(equipoRepository.existsById(1L)).thenReturn(true);
        doNothing().when(equipoRepository).deleteById(1L);

        assertDoesNotThrow(() -> equipoServices.eliminar(1L));
        verify(equipoRepository, times(1)).deleteById(1L);
    }

    @Test
    public void eliminar_noExistente_debeLanzarRuntimeException() {
        when(equipoRepository.existsById(99L)).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> equipoServices.eliminar(99L));

        assertEquals("Equipo no encontrado", ex.getMessage());
        verify(equipoRepository, never()).deleteById(anyLong());
    }

    @Test
    public void actualizar_debeGuardarConCambiosDeNombre() {
        when(equipoRepository.findById(1L)).thenReturn(Optional.of(equipo1));
        when(equipoRepository.save(any(Equipo.class))).thenAnswer(i -> i.getArgument(0));

        Equipo cambios = new Equipo();
        cambios.setNombre("Compresor Actualizado");

        Equipo actualizado = equipoServices.actualizar(1L, cambios);

        assertEquals("Compresor Actualizado", actualizado.getNombre());
        assertEquals(Tipo.MECANICOS, actualizado.getTipo());
        assertEquals("Sala 1", actualizado.getUbicacion());
        verify(equipoRepository, times(1)).save(any(Equipo.class));
    }

    @Test
    public void actualizar_debeCambiarTipoYUbicacion() {
        when(equipoRepository.findById(1L)).thenReturn(Optional.of(equipo1));
        when(equipoRepository.save(any(Equipo.class))).thenAnswer(i -> i.getArgument(0));

        Equipo cambios = new Equipo();
        cambios.setTipo(Tipo.ELECTRICOS);
        cambios.setUbicacion("Sala 3");

        Equipo actualizado = equipoServices.actualizar(1L, cambios);

        assertEquals(Tipo.ELECTRICOS, actualizado.getTipo());
        assertEquals("Sala 3", actualizado.getUbicacion());
        assertEquals("Compresor A", actualizado.getNombre());
        verify(equipoRepository, times(1)).save(any(Equipo.class));
    }

    @Test
    public void actualizar_noExistente_debeLanzarRuntimeException() {
        when(equipoRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> equipoServices.actualizar(99L, new Equipo()));

        assertEquals("Equipo no encontrado", ex.getMessage());
        verify(equipoRepository, never()).save(any(Equipo.class));
    }
}