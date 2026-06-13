import "../styles/mantenciones.css";
import "../styles/card.css";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { obtenerMantenciones, obtenerEquipos, obtenerUsuarios, crearMantencion, subirEvidencia, subirEvidenciaMantencion, BASE_URL } from "../services/api";

function Mantenciones() {
  const [mantenciones, setMantenciones] = useState([]);
  const [filtro, setFiltro] = useState("todos");

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [fechaInicioFiltro, setFechaInicioFiltro] = useState("");
  const [fechaFinFiltro, setFechaFinFiltro] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [equipos, setEquipos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [formError, setFormError] = useState("");
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);

  const [imagenVistaPrevia, setImagenVistaPrevia] = useState(null);

  const [modalEvidencia, setModalEvidencia] = useState(null);
  const [subiendoEvidenciaExistente, setSubiendoEvidenciaExistente] = useState(false);
  const [errorEvidencia, setErrorEvidencia] = useState("");
  const [evidenciaActualizada, setEvidenciaActualizada] = useState(false);

  const [drawerMantencion, setDrawerMantencion] = useState(null);

  const [formData, setFormData] = useState({
    fecha: "",
    detalle: "",
    evidenciaUrl: "",
    proximaFecha: "",
    estado: "AL_DIA",
    equipoId: "",
    usuarioId: ""
  });

  const cargarMantenciones = () => {
    obtenerMantenciones()
      .then(data => setMantenciones(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    cargarMantenciones();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      obtenerEquipos()
        .then(data => setEquipos(data))
        .catch(err => console.error("Error cargando equipos:", err));

      obtenerUsuarios()
        .then(data => setUsuarios(data))
        .catch(err => console.error("Error cargando usuarios:", err));
    }
  }, [isModalOpen]);

  // Cerrar drawer con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setDrawerMantencion(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const total = mantenciones.length;
  const vencidos = mantenciones.filter(m => m.estado === "VENCIDO").length;
  const proximos = mantenciones.filter(m => m.estado === "PROXIMO").length;
  const alDia = mantenciones.filter(m => m.estado === "AL_DIA").length;

  const filtrados = mantenciones.filter(m => {
    const cumpleEstado = filtro === "todos" || m.estado === filtro;
    const fecha = new Date(m.fecha);
    const inicio = fechaInicioFiltro ? new Date(fechaInicioFiltro) : null;
    const fin = fechaFinFiltro ? new Date(fechaFinFiltro) : null;
    const cumpleFecha = (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
    return cumpleEstado && cumpleFecha;
  });

  const badgeEstado = (estado) => {
    if (estado === "AL_DIA")  return <span className="estado verde">Al día</span>;
    if (estado === "PROXIMO") return <span className="estado amarillo">Preventivo</span>;
    if (estado === "VENCIDO") return <span className="estado rojo">Crítico</span>;
    return <span className="estado">-</span>;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArchivoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormError("");
    setSubiendoArchivo(true);

    try {
      const { url } = await subirEvidencia(file);
      setFormData(prev => ({ ...prev, evidenciaUrl: url }));
    } catch (err) {
      console.error(err);
      const msg = err.message || "Error al subir la imagen.";
      setFormError(msg);
      if (msg.toLowerCase().includes("sesión") || msg.toLowerCase().includes("sesion")) {
        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }, 2000);
      }
    } finally {
      setSubiendoArchivo(false);
    }
  };

  const handleSubirEvidenciaExistente = async (e) => {
    const file = e.target.files[0];
    if (!file || !modalEvidencia) return;

    setErrorEvidencia("");
    setEvidenciaActualizada(false);
    setSubiendoEvidenciaExistente(true);

    try {
      const actualizada = await subirEvidenciaMantencion(modalEvidencia.id, file);
      setModalEvidencia(prev => ({ ...prev, evidenciaUrl: actualizada.evidenciaUrl }));
      setEvidenciaActualizada(true);
      cargarMantenciones();
    } catch (err) {
      setErrorEvidencia(err.message || "Error al subir la imagen.");
    } finally {
      setSubiendoEvidenciaExistente(false);
    }
  };

  const cerrarModalEvidencia = () => {
    setModalEvidencia(null);
    setErrorEvidencia("");
    setEvidenciaActualizada(false);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setFormError("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const payload = {
      fecha: formData.fecha,
      detalle: formData.detalle,
      evidenciaUrl: formData.evidenciaUrl || null,
      proximaFecha: formData.proximaFecha,
      estado: formData.estado,
      equipo: { id: parseInt(formData.equipoId) },
      usuario: { id: parseInt(formData.usuarioId) }
    };

    setFormError("");
    crearMantencion(payload)
      .then(() => {
        cerrarModal();
        setFormData({
          fecha: "",
          detalle: "",
          evidenciaUrl: "",
          proximaFecha: "",
          estado: "AL_DIA",
          equipoId: "",
          usuarioId: ""
        });
        cargarMantenciones();
      })
      .catch(err => {
        console.error(err);
        const msg = err.message || "Error al guardar la mantención.";
        setFormError(msg);
        if (msg.toLowerCase().includes("sesión") || msg.toLowerCase().includes("sesion")) {
          setTimeout(() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }, 2000);
        }
      });
  };

  return (
    <motion.div
      className="reportes-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22 }}
    >
      <div className="page-header">
        <h1>Mantenciones</h1>
        <button className="btn-nueva-mantencion" onClick={() => setIsModalOpen(true)}>
          + Nueva Mantención
        </button>
      </div>

      <div className="cards-grid">
        <div className="card card-verde" onClick={() => setFiltro("AL_DIA")}>
          <div className="card-bottom">
            <h3>Al día</h3>
            <p className="numero">{alDia}</p>
          </div>
        </div>

        <div className="card card-naranja" onClick={() => setFiltro("PROXIMO")}>
          <div className="card-bottom">
            <h3>Preventivas</h3>
            <p className="numero">{proximos}</p>
          </div>
        </div>

        <div className="card card-rojo" onClick={() => setFiltro("VENCIDO")}>
          <div className="card-bottom">
            <h3>Críticas</h3>
            <p className="numero">{vencidos}</p>
          </div>
        </div>

        <div className="card card-gris" onClick={() => setFiltro("todos")}>
          <div className="card-bottom">
            <h3>Total</h3>
            <p className="numero">{total}</p>
          </div>
        </div>
      </div>

      <div className="filtros">
        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />

        <button onClick={() => { setFechaInicioFiltro(fechaInicio); setFechaFinFiltro(fechaFin); }}>
          Filtrar
        </button>

        <button onClick={() => {
          setFechaInicio(""); setFechaFin("");
          setFechaInicioFiltro(""); setFechaFinFiltro("");
        }}>
          Limpiar
        </button>
      </div>

      <div className="tabla-wrapper">
        <table className="tabla">
          <thead>
            <tr>
              <th>EQUIPO</th>
              <th>DETALLE</th>
              <th>TÉCNICO</th>
              <th>FECHA</th>
              <th>TIPO</th>
              <th>ESTADO</th>
              <th>PRÓXIMA</th>
              <th>EVIDENCIA</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(m => (
              <tr
                key={m.id}
                className="tabla-fila-clickable"
                onClick={() => setDrawerMantencion(m)}
              >
                <td>{m.equipo?.nombre}</td>
                <td className="td-detalle">{m.detalle}</td>
                <td>{m.usuario?.nombre}</td>
                <td>{m.fecha}</td>
                <td>Preventiva</td>
                <td>{badgeEstado(m.estado)}</td>
                <td>{m.proximaFecha || "-"}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  {m.evidenciaUrl ? (
                    <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                      <button
                        className="btn-ver-evidencia"
                        onClick={() => setImagenVistaPrevia(`${BASE_URL}${m.evidenciaUrl}`)}
                      >
                        📷 Ver foto
                      </button>
                      <button
                        className="btn-ver-evidencia"
                        style={{ borderColor: "#aaa", color: "#aaa" }}
                        onClick={() => { setModalEvidencia({ id: m.id, evidenciaUrl: m.evidenciaUrl }); setEvidenciaActualizada(false); }}
                      >
                        ↑ Reemplazar
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <span style={{ color: "#aaa", fontSize: "13px" }}>Sin evidencia</span>
                      <button
                        className="btn-ver-evidencia"
                        onClick={() => { setModalEvidencia({ id: m.id, evidenciaUrl: null }); setEvidenciaActualizada(false); }}
                      >
                        ↑ Subir foto
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawer lateral de detalle */}
      <AnimatePresence>
        {drawerMantencion && (
          <>
            <motion.div
              className="drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerMantencion(null)}
            />
            <motion.div
              className="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="drawer-header">
                <h3>Detalle de Mantención</h3>
                <button className="drawer-close-btn" onClick={() => setDrawerMantencion(null)}>&times;</button>
              </div>

              <div className="drawer-body">
                <div className="drawer-field">
                  <span className="drawer-label">Equipo</span>
                  <span className="drawer-value">{drawerMantencion.equipo?.nombre || "-"}</span>
                </div>

                <div className="drawer-field">
                  <span className="drawer-label">Técnico</span>
                  <span className="drawer-value">{drawerMantencion.usuario?.nombre || "-"}</span>
                </div>

                <div className="drawer-field">
                  <span className="drawer-label">Fecha de Ejecución</span>
                  <span className="drawer-value">{drawerMantencion.fecha}</span>
                </div>

                <div className="drawer-field">
                  <span className="drawer-label">Próxima Fecha</span>
                  <span className="drawer-value">{drawerMantencion.proximaFecha || "-"}</span>
                </div>

                <div className="drawer-field">
                  <span className="drawer-label">Tipo</span>
                  <span className="drawer-value">Preventiva</span>
                </div>

                <div className="drawer-field">
                  <span className="drawer-label">Estado</span>
                  <span className="drawer-value">{badgeEstado(drawerMantencion.estado)}</span>
                </div>

                <div className="drawer-field drawer-field--full">
                  <span className="drawer-label">Detalle del Trabajo</span>
                  <p className="drawer-detalle">{drawerMantencion.detalle || "-"}</p>
                </div>

                <div className="drawer-field drawer-field--full">
                  <span className="drawer-label">Evidencia</span>
                  {drawerMantencion.evidenciaUrl ? (
                    <div className="drawer-evidencia">
                      <img
                        src={`${BASE_URL}${drawerMantencion.evidenciaUrl}`}
                        alt="Evidencia"
                        className="drawer-img"
                        onClick={() => setImagenVistaPrevia(`${BASE_URL}${drawerMantencion.evidenciaUrl}`)}
                      />
                      <div className="drawer-evidencia-btns">
                        <button
                          className="btn-ver-evidencia"
                          onClick={() => setImagenVistaPrevia(`${BASE_URL}${drawerMantencion.evidenciaUrl}`)}
                        >
                          📷 Ver foto completa
                        </button>
                        <button
                          className="btn-ver-evidencia"
                          style={{ borderColor: "#aaa", color: "#aaa" }}
                          onClick={() => { setModalEvidencia({ id: drawerMantencion.id, evidenciaUrl: drawerMantencion.evidenciaUrl }); setEvidenciaActualizada(false); }}
                        >
                          ↑ Reemplazar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="drawer-evidencia-btns">
                      <span style={{ color: "#aaa", fontSize: "13px" }}>Sin evidencia registrada</span>
                      <button
                        className="btn-ver-evidencia"
                        onClick={() => { setModalEvidencia({ id: drawerMantencion.id, evidenciaUrl: null }); setEvidenciaActualizada(false); }}
                      >
                        ↑ Subir foto
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal vista previa de imagen */}
      {imagenVistaPrevia && (
        <div className="modal-overlay" onClick={() => setImagenVistaPrevia(null)}>
          <div
            className="modal-card"
            style={{ maxWidth: "600px", textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Evidencia fotográfica</h3>
              <button className="modal-close-btn" onClick={() => setImagenVistaPrevia(null)}>&times;</button>
            </div>
            <div style={{ padding: "16px" }}>
              <img
                src={imagenVistaPrevia}
                alt="Evidencia"
                style={{ maxWidth: "100%", maxHeight: "500px", borderRadius: "8px", objectFit: "contain" }}
              />
              <div style={{ marginTop: "12px" }}>
                <a
                  href={imagenVistaPrevia}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "13px", color: "#4A90E2" }}
                >
                  Abrir en nueva pestaña ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal subir/reemplazar evidencia en mantención existente */}
      {modalEvidencia && (
        <div className="modal-overlay" onClick={cerrarModalEvidencia}>
          <div
            className="modal-card"
            style={{ maxWidth: "420px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{modalEvidencia.evidenciaUrl ? "Reemplazar evidencia" : "Subir evidencia"}</h3>
              <button className="modal-close-btn" onClick={cerrarModalEvidencia}>&times;</button>
            </div>
            <div style={{ padding: "16px" }}>

              {modalEvidencia.evidenciaUrl && (
                <div style={{ marginBottom: "12px" }}>
                  <p style={{ fontSize: "13px", color: "#666", marginBottom: "8px" }}>Evidencia actual:</p>
                  <img
                    src={`${BASE_URL}${modalEvidencia.evidenciaUrl}`}
                    alt="Evidencia actual"
                    style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "6px", objectFit: "contain" }}
                  />
                </div>
              )}

              {!modalEvidencia.evidenciaUrl && (
                <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "12px" }}>
                  No hay evidencia subida para esta mantención.
                </p>
              )}

              <label style={{ fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "8px" }}>
                {modalEvidencia.evidenciaUrl ? "Seleccionar nueva foto:" : "Seleccionar foto:"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleSubirEvidenciaExistente}
                disabled={subiendoEvidenciaExistente}
              />

              {subiendoEvidenciaExistente && (
                <p style={{ marginTop: "10px", fontSize: "13px", color: "#4A90E2" }}>Subiendo imagen...</p>
              )}
              {errorEvidencia && (
                <p style={{ marginTop: "10px", fontSize: "13px", color: "#e53e3e" }}>❌ {errorEvidencia}</p>
              )}
              {evidenciaActualizada && !subiendoEvidenciaExistente && (
                <p style={{ marginTop: "10px", fontSize: "13px", color: "#38a169" }}>✅ Evidencia actualizada correctamente</p>
              )}

              <div style={{ marginTop: "16px", textAlign: "right" }}>
                <button className="btn-cancelar" onClick={cerrarModalEvidencia}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal nuevo registro */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">

            <div className="modal-header">
              <h3>Registrar Nueva Mantención</h3>
              <button className="modal-close-btn" onClick={cerrarModal}>&times;</button>
            </div>

            <form className="modal-form" onSubmit={handleFormSubmit}>

              <div className="form-group">
                <label>Detalle del Trabajo</label>
                <textarea
                  name="detalle"
                  required
                  rows="3"
                  value={formData.detalle}
                  onChange={handleInputChange}
                  placeholder="Ej. Cambio de bujías y filtros de aceite..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha Ejecución</label>
                  <input
                    type="date"
                    name="fecha"
                    required
                    value={formData.fecha}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Próxima Fecha</label>
                  <input
                    type="date"
                    name="proximaFecha"
                    required
                    value={formData.proximaFecha}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Equipo del Condominio</label>
                <select
                  name="equipoId"
                  required
                  value={formData.equipoId}
                  onChange={handleInputChange}
                >
                  <option value="">-- Seleccione el Equipo --</option>
                  {equipos.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.nombre} - ({eq.ubicacion})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Técnico Encargado</label>
                <select
                  name="usuarioId"
                  required
                  value={formData.usuarioId}
                  onChange={handleInputChange}
                >
                  <option value="">-- Seleccione el Técnico --</option>
                  {usuarios.map(us => (
                    <option key={us.id} value={us.id}>{us.nombre} ({us.rol})</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Estado Inicial</label>
                  <select name="estado" value={formData.estado} onChange={handleInputChange}>
                    <option value="AL_DIA">Al día</option>
                    <option value="PROXIMO">Preventivo</option>
                    <option value="VENCIDO">Crítico</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Evidencia (Foto)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleArchivoChange}
                  />
                  {subiendoArchivo && <small>Subiendo imagen...</small>}
                  {formData.evidenciaUrl && !subiendoArchivo && (
                    <div style={{ marginTop: "6px" }}>
                      <small>✅ Imagen cargada</small>
                      <img
                        src={`${BASE_URL}${formData.evidenciaUrl}`}
                        alt="Vista previa evidencia"
                        style={{ maxWidth: "120px", display: "block", marginTop: "4px", borderRadius: "6px" }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {formError && (
                <div className="form-error">❌ {formError}</div>
              )}

              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  Guardar Registro
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Mantenciones;