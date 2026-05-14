USE base;

-- =====================================================
-- USUARIOS
-- =====================================================

INSERT INTO usuario (nombre, email, password, rol)
VALUES
('Carlos Mendoza','carlos.mendoza@preventech.com','$2a$10$NHvJP6MKws7EtATSIWYLveB6gJ5/.CEhG9pFxndYsFtcYzobwCzdu','TECNICO'),
('María González','maria.gonzalez@preventech.com','$2a$10$NHvJP6MKws7EtATSIWYLveB6gJ5/.CEhG9pFxndYsFtcYzobwCzdu','SUPERVISOR'),
('Maira Vidal','maira.vidal@preventech.com','$2a$10$NHvJP6MKws7EtATSIWYLveB6gJ5/.CEhG9pFxndYsFtcYzobwCzdu','ADMINISTRADOR'),
('Lesly Díaz','lesly.diaz@preventech.com','$2a$10$NHvJP6MKws7EtATSIWYLveB6gJ5/.CEhG9pFxndYsFtcYzobwCzdu','ADMINISTRADOR'),
('Ruth Gonzalez','ruth.gonzalez@preventech.com','$2a$10$NHvJP6MKws7EtATSIWYLveB6gJ5/.CEhG9pFxndYsFtcYzobwCzdu','ADMINISTRADOR');

-- =====================================================
-- EQUIPOS
-- =====================================================

INSERT INTO equipo (nombre, tipo, ubicacion, estado)
VALUES
('Bomba agua', 'MECANICOS', 'Sala máquinas', 'PROXIMO'),
('Compresor', 'ROTATIVOS', 'Subterráneo', 'VENCIDO'),
('Motor eléctrico', 'ELECTRICOS', 'Piso 1', 'VENCIDO'),
('Panel solar', 'ELECTRICOS', 'Techo', 'AL_DIA'),
('Caldera', 'ESTATICOS', 'Sala técnica', 'PROXIMO'),
('Generador diesel', 'ROTATIVOS', 'Exterior', 'VENCIDO'),
('Sistema HVAC', 'MECANICOS', 'Piso 3', 'AL_DIA'),
('Ascensor', 'MECANICOS', 'Edificio A', 'PROXIMO'),
('Transformador', 'ELECTRICOS', 'Subestación', 'VENCIDO'),
('Bomba contra incendio', 'MECANICOS', 'Subterráneo', 'AL_DIA'),
('Extractor industrial', 'ROTATIVOS', 'Planta', 'PROXIMO'),
('UPS respaldo', 'ELECTRICOS', 'Sala servidores', 'VENCIDO');

-- =====================================================
-- MANTENCIONES
-- =====================================================

INSERT INTO mantencion (
    fecha,
    detalle,
    evidencia_url,
    proxima_fecha,
    estado,
    equipo_id,
    usuario_id
)
VALUES
('2026-04-20', 'Mantención preventiva bomba agua', 'evidencias/bomba1.jpg', '2026-07-20', 'PROXIMO', 1, 1),
('2026-03-10', 'Revisión compresor industrial', 'evidencias/compresor.jpg', '2026-06-10', 'VENCIDO', 2, 1),
('2026-03-01', 'Cambio de piezas motor eléctrico', 'evidencias/motor.jpg', '2026-06-01', 'VENCIDO', 3, 1),
('2026-06-10', 'Chequeo panel solar', 'evidencias/panel.jpg', '2026-09-10', 'AL_DIA', 4, 2),
('2026-04-28', 'Mantención caldera', 'evidencias/caldera.jpg', '2026-07-28', 'PROXIMO', 5, 2),
('2026-02-15', 'Servicio generador diesel', 'evidencias/generador.jpg', '2026-05-15', 'VENCIDO', 6, 1),
('2026-05-15', 'Inspección sistema HVAC', 'evidencias/hvac.jpg', '2026-08-15', 'AL_DIA', 7, 2),
('2026-04-25', 'Revisión ascensor principal', 'evidencias/ascensor.jpg', '2026-07-25', 'PROXIMO', 8, 1),
('2026-01-20', 'Mantención transformador', 'evidencias/transformador.jpg', '2026-04-20', 'VENCIDO', 9, 2),
('2026-05-30', 'Prueba bomba incendio', 'evidencias/incendio.jpg', '2026-08-30', 'AL_DIA', 10, 1),
('2026-04-18', 'Limpieza extractor industrial', 'evidencias/extractor.jpg', '2026-07-18', 'PROXIMO', 11, 2),
('2026-03-22', 'Revisión UPS respaldo', 'evidencias/ups.jpg', '2026-06-22', 'VENCIDO', 12, 1);

-- =====================================================
-- ALERTAS
-- =====================================================

INSERT INTO alerta (color, mensaje, mantencion_id)
VALUES
('ROJO', 'Compresor con mantención vencida', 2),
('ROJO', 'Motor eléctrico requiere atención inmediata', 3),
('AMARILLO', 'Bomba agua próxima a mantención', 1),
('AMARILLO', 'Ascensor próximo a revisión', 8),
('ROJO', 'Transformador con mantención vencida', 9),
('VERDE', 'Panel solar al día', 4);