package com.preventech.backend.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.preventech.backend.entities.Alerta;
import com.preventech.backend.entities.Equipo;
import com.preventech.backend.entities.Mantencion;
import com.preventech.backend.enums.Color;
import com.preventech.backend.repositories.AlertaRepository;
import com.preventech.backend.repositories.MantencionRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class AlertaServiceImplTest {

    @Mock
    private AlertaRepository alertaRepository;

    @Mock
    private MantencionRepository mantencionRepository;

    @InjectMocks
    private AlertaServiceImpl alertaServices;

    private Alerta alerta1;
    private Alerta alerta2;

    @BeforeEach
    public void setup() {
        alerta1 = new Alerta();
        alerta1.setId(1L);
        alerta1.setColor(Color.VERDE);
        alerta1.setTipo("AL_DIA");
        alerta1.setMensaje("Mantención al día");
        alerta1.setFechaGenerada(LocalDate.now());

        alerta2 = new Alerta();
        alerta2.setId(2L);
        alerta2.setColor(Color.ROJO);
        alerta2.setTipo("CRITICO");
        alerta2.setMensaje("Mantención vencida");
        alerta2.setFechaGenerada(LocalDate.now().minusDays(1));
    }

    @Test
    public void crear_debeRetornarAlertaGuardada() {
        when(alertaRepository.save(any(Alerta.class))).thenAnswer(inv -> {
            Alerta a = inv.getArgument(0);
            a.setId(10L);
            return a;
        });

        Alerta nueva = new Alerta();
        nueva.setColor(Color.AMARILLO);
        nueva.setTipo("PREVENTIVO");
        nueva.setMensaje("Próxima mantención");
        nueva.setFechaGenerada(LocalDate.now());

        Alerta creada = alertaServices.crear(nueva);

        assertNotNull(creada);
        assertEquals(10L, creada.getId());
        assertEquals(Color.AMARILLO, creada.getColor());
        verify(alertaRepository, times(1)).save(any(Alerta.class));
    }

    @Test
    public void obtenerId_existente_debeRetornarAlerta() {
        when(alertaRepository.findById(1L)).thenReturn(Optional.of(alerta1));

        Alerta resultado = alertaServices.obtenerId(1L);

        assertNotNull(resultado);
        assertEquals(Color.VERDE, resultado.getColor());
        verify(alertaRepository, times(1)).findById(1L);
    }

    @Test
    public void obtenerId_noExistente_debeLanzarRuntimeException() {
        when(alertaRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> alertaServices.obtenerId(99L));

        assertEquals("Alerta no encontrada con id: 99", ex.getMessage());
        verify(alertaRepository, times(1)).findById(99L);
    }

    @Test
    public void listarTodos_debeRetornarListaOrdenadaPorFecha() {
        when(alertaRepository.findAllByOrderByFechaGeneradaDescIdDesc())
                .thenReturn(Arrays.asList(alerta1, alerta2));

        List<Alerta> lista = alertaServices.listarTodos();

        assertEquals(2, lista.size());
        verify(alertaRepository, times(1)).findAllByOrderByFechaGeneradaDescIdDesc();
    }

    @Test
    public void listarRecientes_debeRetornarTop3Alertas() {
        when(alertaRepository.findTop3ByOrderByFechaGeneradaDescIdDesc())
                .thenReturn(Arrays.asList(alerta1, alerta2));

        List<Alerta> lista = alertaServices.listarRecientes();

        assertEquals(2, lista.size());
        verify(alertaRepository, times(1)).findTop3ByOrderByFechaGeneradaDescIdDesc();
    }

    @Test
    public void eliminar_existente_debeEliminarSinError() {
        when(alertaRepository.existsById(1L)).thenReturn(true);
        doNothing().when(alertaRepository).deleteById(1L);

        assertDoesNotThrow(() -> alertaServices.eliminar(1L));
        verify(alertaRepository, times(1)).deleteById(1L);
    }

    @Test
    public void eliminar_noExistente_debeLanzarRuntimeException() {
        when(alertaRepository.existsById(99L)).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> alertaServices.eliminar(99L));

        assertEquals("No se puede eliminar: Alerta no encontrada", ex.getMessage());
        verify(alertaRepository, never()).deleteById(anyLong());
    }

    @Test
    public void actualizar_debeCambiarColorYMensaje() {
        when(alertaRepository.findById(1L)).thenReturn(Optional.of(alerta1));
        when(alertaRepository.save(any(Alerta.class))).thenAnswer(i -> i.getArgument(0));

        Alerta cambios = new Alerta();
        cambios.setColor(Color.ROJO);
        cambios.setMensaje("Ahora es crítico");

        Alerta actualizada = alertaServices.actualizar(1L, cambios);

        assertEquals(Color.ROJO, actualizada.getColor());
        assertEquals("Ahora es crítico", actualizada.getMensaje());
        verify(alertaRepository, times(1)).save(any(Alerta.class));
    }

    @Test
    public void actualizar_soloMensaje_debePreservarColor() {
        when(alertaRepository.findById(1L)).thenReturn(Optional.of(alerta1));
        when(alertaRepository.save(any(Alerta.class))).thenAnswer(i -> i.getArgument(0));

        Alerta cambios = new Alerta();
        cambios.setMensaje("Nuevo mensaje");

        Alerta actualizada = alertaServices.actualizar(1L, cambios);

        assertEquals(Color.VERDE, actualizada.getColor());
        assertEquals("Nuevo mensaje", actualizada.getMensaje());
        verify(alertaRepository, times(1)).save(any(Alerta.class));
    }

    @Test
    public void actualizar_noExistente_debeLanzarRuntimeException() {
        when(alertaRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> alertaServices.actualizar(99L, new Alerta()));

        assertEquals("Alerta no encontrada con id: 99", ex.getMessage());
        verify(alertaRepository, never()).save(any(Alerta.class));
    }

    private Mantencion crearMantencionConFecha(Long id, LocalDate proximaFecha) {
        Equipo equipo = new Equipo();
        equipo.setId(1L);
        equipo.setNombre("Compresor A");

        Mantencion m = new Mantencion();
        m.setId(id);
        m.setProximaFecha(proximaFecha);
        m.setEquipo(equipo);
        return m;
    }

    @Test
    public void generarAlertas_mantencionNueva_masde7Dias_debeCrearAlertaVerde() {
        LocalDate proximaFecha = LocalDate.now().plusDays(10);
        Mantencion m = crearMantencionConFecha(1L, proximaFecha);

        when(mantencionRepository.findAll()).thenReturn(Collections.singletonList(m));
        when(alertaRepository.findByMantencionId(1L)).thenReturn(Optional.empty());
        when(alertaRepository.save(any(Alerta.class))).thenAnswer(inv -> inv.getArgument(0));

        alertaServices.generarAlertasDesdeMantencion();

        ArgumentCaptor<Alerta> captor = ArgumentCaptor.forClass(Alerta.class);
        verify(alertaRepository, times(1)).save(captor.capture());

        Alerta guardada = captor.getValue();
        assertEquals(Color.VERDE, guardada.getColor());
        assertEquals("AL_DIA", guardada.getTipo());
        assertEquals(LocalDate.now(), guardada.getFechaGenerada());
    }

    @Test
    public void generarAlertas_mantencionNueva_entre0y7Dias_debeCrearAlertaAmarilla() {
        LocalDate proximaFecha = LocalDate.now().plusDays(3);
        Mantencion m = crearMantencionConFecha(2L, proximaFecha);

        when(mantencionRepository.findAll()).thenReturn(Collections.singletonList(m));
        when(alertaRepository.findByMantencionId(2L)).thenReturn(Optional.empty());
        when(alertaRepository.save(any(Alerta.class))).thenAnswer(inv -> inv.getArgument(0));

        alertaServices.generarAlertasDesdeMantencion();

        ArgumentCaptor<Alerta> captor = ArgumentCaptor.forClass(Alerta.class);
        verify(alertaRepository, times(1)).save(captor.capture());

        Alerta guardada = captor.getValue();
        assertEquals(Color.AMARILLO, guardada.getColor());
        assertEquals("PREVENTIVO", guardada.getTipo());
    }

    @Test
    public void generarAlertas_mantencionNueva_vencida_debeCrearAlertaRoja() {
        LocalDate proximaFecha = LocalDate.now().minusDays(5);
        Mantencion m = crearMantencionConFecha(3L, proximaFecha);

        when(mantencionRepository.findAll()).thenReturn(Collections.singletonList(m));
        when(alertaRepository.findByMantencionId(3L)).thenReturn(Optional.empty());
        when(alertaRepository.save(any(Alerta.class))).thenAnswer(inv -> inv.getArgument(0));

        alertaServices.generarAlertasDesdeMantencion();

        ArgumentCaptor<Alerta> captor = ArgumentCaptor.forClass(Alerta.class);
        verify(alertaRepository, times(1)).save(captor.capture());

        Alerta guardada = captor.getValue();
        assertEquals(Color.ROJO, guardada.getColor());
        assertEquals("CRITICO", guardada.getTipo());
    }

    @Test
    public void generarAlertas_alertaExistente_mismoTipo_noDebeCambiarFecha() {
        LocalDate proximaFecha = LocalDate.now().plusDays(10);
        Mantencion m = crearMantencionConFecha(4L, proximaFecha);

        Alerta existente = new Alerta();
        existente.setId(10L);
        existente.setTipo("AL_DIA");
        existente.setColor(Color.VERDE);
        existente.setFechaGenerada(LocalDate.now().minusDays(2));
        existente.setMensaje("Mantención al día: Compresor A (próxima el " + proximaFecha + ")");

        when(mantencionRepository.findAll()).thenReturn(Collections.singletonList(m));
        when(alertaRepository.findByMantencionId(4L)).thenReturn(Optional.of(existente));
        when(alertaRepository.save(any(Alerta.class))).thenAnswer(inv -> inv.getArgument(0));

        alertaServices.generarAlertasDesdeMantencion();

        ArgumentCaptor<Alerta> captor = ArgumentCaptor.forClass(Alerta.class);
        verify(alertaRepository, times(1)).save(captor.capture());
        assertEquals(LocalDate.now().minusDays(2), captor.getValue().getFechaGenerada());
    }

    @Test
    public void generarAlertas_alertaExistente_cambioDeTipo_debeActualizarYRenovarFecha() {
        LocalDate proximaFecha = LocalDate.now().plusDays(3);
        Mantencion m = crearMantencionConFecha(5L, proximaFecha);

        Alerta existente = new Alerta();
        existente.setId(11L);
        existente.setTipo("AL_DIA");
        existente.setColor(Color.VERDE);
        existente.setFechaGenerada(LocalDate.now().minusDays(5));

        when(mantencionRepository.findAll()).thenReturn(Collections.singletonList(m));
        when(alertaRepository.findByMantencionId(5L)).thenReturn(Optional.of(existente));
        when(alertaRepository.save(any(Alerta.class))).thenAnswer(inv -> inv.getArgument(0));

        alertaServices.generarAlertasDesdeMantencion();

        ArgumentCaptor<Alerta> captor = ArgumentCaptor.forClass(Alerta.class);
        verify(alertaRepository, times(1)).save(captor.capture());

        Alerta actualizada = captor.getValue();
        assertEquals(Color.AMARILLO, actualizada.getColor());
        assertEquals("PREVENTIVO", actualizada.getTipo());
        assertEquals(LocalDate.now(), actualizada.getFechaGenerada());
    }

    @Test
    public void generarAlertas_criticoYaRenovadaHoy_noDebeVolvAGuardar() {
        LocalDate proximaFecha = LocalDate.now().minusDays(2);
        Mantencion m = crearMantencionConFecha(6L, proximaFecha);

        Alerta existente = new Alerta();
        existente.setId(12L);
        existente.setTipo("CRITICO");
        existente.setColor(Color.ROJO);
        existente.setFechaGenerada(LocalDate.now());

        when(mantencionRepository.findAll()).thenReturn(Collections.singletonList(m));
        when(alertaRepository.findByMantencionId(6L)).thenReturn(Optional.of(existente));

        alertaServices.generarAlertasDesdeMantencion();

        verify(alertaRepository, never()).save(any(Alerta.class));
    }

    @Test
    public void generarAlertas_criticoNoRenovadaHoy_debeRenovar() {
        LocalDate proximaFecha = LocalDate.now().minusDays(2);
        Mantencion m = crearMantencionConFecha(7L, proximaFecha);

        Alerta existente = new Alerta();
        existente.setId(13L);
        existente.setTipo("CRITICO");
        existente.setColor(Color.ROJO);
        existente.setFechaGenerada(LocalDate.now().minusDays(1));

        when(mantencionRepository.findAll()).thenReturn(Collections.singletonList(m));
        when(alertaRepository.findByMantencionId(7L)).thenReturn(Optional.of(existente));
        when(alertaRepository.save(any(Alerta.class))).thenAnswer(inv -> inv.getArgument(0));

        alertaServices.generarAlertasDesdeMantencion();

        ArgumentCaptor<Alerta> captor = ArgumentCaptor.forClass(Alerta.class);
        verify(alertaRepository, times(1)).save(captor.capture());
        assertEquals(LocalDate.now(), captor.getValue().getFechaGenerada());
    }

    @Test
    public void generarAlertas_mantencionSinProximaFecha_debeIgnorarse() {
        Mantencion m = new Mantencion();
        m.setId(8L);
        m.setProximaFecha(null);

        when(mantencionRepository.findAll()).thenReturn(Collections.singletonList(m));

        alertaServices.generarAlertasDesdeMantencion();

        verify(alertaRepository, never()).save(any(Alerta.class));
    }
}