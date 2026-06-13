package com.preventech.backend.services;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.preventech.backend.entities.Alerta;
import com.preventech.backend.entities.Mantencion;
import com.preventech.backend.enums.Color;
import com.preventech.backend.repositories.AlertaRepository;
import com.preventech.backend.repositories.MantencionRepository;

@Service
public class AlertaServiceImpl implements AlertaService {

    private final AlertaRepository alertaRepository;
    private final MantencionRepository mantencionRepository;

    AlertaServiceImpl(AlertaRepository alertaRepository,
                      MantencionRepository mantencionRepository) {
        this.alertaRepository = alertaRepository;
        this.mantencionRepository = mantencionRepository;
    }

    @Override
    public Alerta crear(Alerta alerta) {
        return alertaRepository.save(alerta);
    }

    @Override
    public Alerta obtenerId(Long id) {
        return alertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerta no encontrada con id: " + id));
    }

    @Override
    public List<Alerta> listarTodos() {
        return alertaRepository.findAllByOrderByFechaGeneradaDescIdDesc();
    }

    @Override
    public List<Alerta> listarRecientes() {
        return alertaRepository.findTop3ByOrderByFechaGeneradaDescIdDesc();
    }

    @Override
    public void eliminar(Long id) {
        if (!alertaRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar: Alerta no encontrada");
        }
        alertaRepository.deleteById(id);
    }

    @Override
    public Alerta actualizar(Long id, Alerta alertaActualizada) {
        Alerta existente = obtenerId(id);

        if (alertaActualizada.getColor() != null) {
            existente.setColor(alertaActualizada.getColor());
        }

        if (alertaActualizada.getMensaje() != null) {
            existente.setMensaje(alertaActualizada.getMensaje());
        }

        return alertaRepository.save(existente);
    }

    /**
     * Lógica principal de generación de alertas por fecha de mantención.
     *
     * IMPORTANTE: Alerta tiene una relación @OneToOne con Mantencion
     * (columna mantencion_id es UNIQUE) => como máximo existe UNA fila
     * de alerta por mantención. Por lo tanto NUNCA se inserta una fila
     * nueva si ya existe una para esa mantención; siempre se actualiza
     * la existente.
     *
     * Reglas:
     *  - AL_DIA  (VERDE):      próxima fecha > 7 días.
     *  - PREVENTIVO (AMARILLO): próxima fecha entre 0 y 7 días.
     *  - CRITICO (ROJO):       próxima fecha ya pasó (vencida).
     *
     * Reenvío:
     *  - AL_DIA / PREVENTIVO: solo se "renueva" (fechaGenerada = hoy) si
     *    el tipo/color cambió respecto al estado anterior. Si sigue
     *    igual, no se vuelve a notificar.
     *  - CRITICO: se "renueva" (fechaGenerada = hoy) cada día que la
     *    mantención siga vencida, mientras no se haya renovado hoy aún.
     */
    @Override
    public void generarAlertasDesdeMantencion() {
        LocalDate hoy = LocalDate.now();
        List<Mantencion> mantenciones = (List<Mantencion>) mantencionRepository.findAll();

        for (Mantencion m : mantenciones) {
            if (m.getProximaFecha() == null) continue;

            LocalDate proxima = m.getProximaFecha();
            long diasRestantes = ChronoUnit.DAYS.between(hoy, proxima);

            Color color;
            String tipo;
            String mensaje;

            if (diasRestantes > 7) {
                color = Color.VERDE;
                tipo = "AL_DIA";
                mensaje = "Mantención al día: " + nombreEquipo(m) + " (próxima el " + proxima + ")";
            } else if (diasRestantes >= 0) {
                color = Color.AMARILLO;
                tipo = "PREVENTIVO";
                mensaje = "Mantención próxima en " + diasRestantes + " día(s): " + nombreEquipo(m) + " (vence " + proxima + ")";
            } else {
                color = Color.ROJO;
                tipo = "CRITICO";
                long diasVencida = Math.abs(diasRestantes);
                mensaje = "¡CRÍTICO! Mantención vencida hace " + diasVencida + " día(s): " + nombreEquipo(m) + " (venció " + proxima + ")";
            }

            Optional<Alerta> existenteOpt = alertaRepository.findByMantencionId(m.getId());

            if (existenteOpt.isEmpty()) {
                Alerta nueva = new Alerta();
                nueva.setColor(color);
                nueva.setTipo(tipo);
                nueva.setMensaje(mensaje);
                nueva.setFechaGenerada(hoy);
                nueva.setMantencion(m);
                alertaRepository.save(nueva);
                continue;
            }

            Alerta existente = existenteOpt.get();
            boolean cambioDeTipo = !tipo.equals(existente.getTipo());

            if (Color.ROJO.equals(color)) {
                boolean yaRenovadaHoy = hoy.equals(existente.getFechaGenerada());
                if (cambioDeTipo || !yaRenovadaHoy) {
                    existente.setColor(color);
                    existente.setTipo(tipo);
                    existente.setMensaje(mensaje);
                    existente.setFechaGenerada(hoy);
                    alertaRepository.save(existente);
                }
            } else {
                if (cambioDeTipo) {
                    existente.setColor(color);
                    existente.setTipo(tipo);
                    existente.setMensaje(mensaje);
                    existente.setFechaGenerada(hoy);
                    alertaRepository.save(existente);
                } else {
                    existente.setMensaje(mensaje);
                    alertaRepository.save(existente);
                }
            }
        }
    }

    private String nombreEquipo(Mantencion m) {
        if (m.getEquipo() != null && m.getEquipo().getNombre() != null) {
            return m.getEquipo().getNombre();
        }
        return "Equipo #" + (m.getEquipo() != null ? m.getEquipo().getId() : "?");
    }
}