package com.preventech.backend.scheduler;

import com.preventech.backend.services.AlertaService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class AlertaScheduler {

    private final AlertaService alertaService;

    public AlertaScheduler(AlertaService alertaService) {
        this.alertaService = alertaService;
    }

    /**
     * Ejecuta todos los días a las 8:00 AM.
     * También se dispara al iniciar la aplicación gracias al método de inicialización.
     */
    @Scheduled(cron = "0 0 8 * * *")
    public void generarAlertasDiarias() {
        alertaService.generarAlertasDesdeMantencion();
    }
}