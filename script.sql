-- =====================================================
-- CREACIÓN DE TABLAS (Estructura base para la nube)
-- =====================================================

CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS equipo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(100),
    ubicacion VARCHAR(255),
    estado VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS mantencion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE,
    detalle TEXT,
    evidencia_url VARCHAR(255),
    proxima_fecha DATE,
    estado VARCHAR(50),
    equipo_id INT,
    usuario_id INT,
    FOREIGN KEY (equipo_id) REFERENCES equipo(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS alerta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    color VARCHAR(50),
    mensaje VARCHAR(255),
    mantencion_id INT,
    FOREIGN KEY (mantencion_id) REFERENCES mantencion(id)
);

-- =====================================================
-- USUARIOS
-- =====================================================

INSERT INTO usuario (id, nombre, email, password, rol)
VALUES
(1, 'Carlos Mendoza','carlos.mendoza@gmail.com','$2a$10$NHvJP6MKws7EtATSIWYLveB6gJ5/.CEhG9pFxndYsFtcYzobwCzdu','TECNICO'),
(2, 'María González','maria.gonzalez@gmail.com','$2a$10$NHvJP6MKws7EtATSIWYLveB6gJ5/.CEhG9pFxndYsFtcYzobwCzdu','SUPERVISOR'),
(3, 'Maira Vidal','maira.vidal@gmail.com','$2a$10$NHvJP6MKws7EtATSIWYLveB6gJ5/.CEhG9pFxndYsFtcYzobwCzdu','ADMINISTRADOR'),
(4, 'Lesly Díaz','lesly.diaz@gmail.com','$2a$10$NHvJP6MKws7EtATSIWYLveB6gJ5/.CEhG9pFxndYsFtcYzobwCzdu','ADMINISTRADOR'),
(5, 'Ruth Gonzalez','ruth.gonzalez@gmail.com','$2a$10$NHvJP6MKws7EtATSIWYLveB6gJ5/.CEhG9pFxndYsFtcYzobwCzdu','ADMINISTRADOR')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- =====================================================
-- EQUIPOS
-- =====================================================

INSERT INTO equipo (id, nombre, tipo, ubicacion, estado)
VALUES
(1, 'Bomba agua', 'MECANICOS', 'Sala máquinas', 'PROXIMO'),
(2, 'Compresor', 'ROTATIVOS', 'Subterráneo', 'VENCIDO'),
(3, 'Motor eléctrico', 'ELECTRICOS', 'Piso 1', 'VENCIDO'),
(4, 'Panel solar', 'ELECTRICOS', 'Techo', 'AL_DIA'),
(5, 'Caldera', 'ESTATICOS', 'Sala técnica', 'PROXIMO'),
(6, 'Generador diesel', 'ROTATIVOS', 'Exterior', 'VENCIDO'),
(7, 'Sistema HVAC', 'MECANICOS', 'Piso 3', 'AL_DIA'),
(8, 'Ascensor', 'MECANICOS', 'Edificio A', 'PROXIMO'),
(9, 'Transformador', 'ELECTRICOS', 'Subestación', 'VENCIDO'),
(10, 'Bomba contra incendio', 'MECANICOS', 'Subterráneo', 'AL_DIA'),
(11, 'Extractor industrial', 'ROTATIVOS', 'Planta', 'PROXIMO'),
(12, 'UPS respaldo', 'ELECTRICOS', 'Sala servidores', 'VENCIDO')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- =====================================================
-- MANTENCIONES
-- =====================================================

INSERT INTO mantencion (
    id,
    fecha,
    detalle,
    evidencia_url,
    proxima_fecha,
    estado,
    equipo_id,
    usuario_id
)
VALUES
(1, '2026-04-20', 'Mantención preventiva bomba agua', 'evidencias/bomba1.jpg', '2026-07-20', 'PROXIMO', 1, 1),
(2, '2026-03-10', 'Revisión compresor industrial', 'evidencias/compresor.jpg', '2026-06-10', 'VENCIDO', 2, 1),
(3, '2026-03-01', 'Cambio de piezas motor eléctrico', 'evidencias/motor.jpg', '2026-06-01', 'VENCIDO', 3, 1),
(4, '2026-06-10', 'Chequeo panel solar', 'evidencias/panel.jpg', '2026-09-10', 'AL_DIA', 4, 2),
(5, '2026-04-28', 'Mantención caldera', 'evidencias/caldera.jpg', '2026-07-28', 'PROXIMO', 5, 2),
(6, '2026-02-15', 'Servicio generador diesel', 'evidencias/generador.jpg', '2026-05-15', 'VENCIDO', 6, 1),
(7, '2026-05-15', 'Inspección sistema HVAC', 'evidencias/hvac.jpg', '2026-08-15', 'AL_DIA', 7, 2),
(8, '2026-04-25', 'Revisión ascensor principal', 'evidencias/ascensor.jpg', '2026-07-25', 'PROXIMO', 8, 1),
(9, '2026-01-20', 'Mantención transformador', 'evidencias/transformador.jpg', '2026-04-20', 'VENCIDO', 9, 2),
(10, '2026-05-30', 'Prueba bomba incendio', 'evidencias/incendio.jpg', '2026-08-30', 'AL_DIA', 10, 1),
(11, '2026-04-18', 'Limpieza extractor industrial', 'evidencias/extractor.jpg', '2026-07-18', 'PROXIMO', 11, 2),
(12, '2026-03-22', 'Revisión UPS respaldo', 'evidencias/ups.jpg', '2026-06-22', 'VENCIDO', 12, 1)
ON DUPLICATE KEY UPDATE detalle=VALUES(detalle);

-- =====================================================
-- ALERTAS
-- =====================================================

INSERT INTO alerta (id, color, mensaje, mantencion_id)
VALUES
(1, 'ROJO', 'Compresor con mantención vencida', 2),
(2, 'ROJO', 'Motor eléctrico requiere atención inmediata', 3),
(3, 'AMARILLO', 'Bomba agua próxima a mantención', 1),
(4, 'AMARILLO', 'Ascensor próximo a revisión', 8),
(5, 'ROJO', 'Transformador con mantención vencida', 9),
(6, 'VERDE', 'Panel solar al día', 4)
ON DUPLICATE KEY UPDATE mensaje=VALUES(mensaje);