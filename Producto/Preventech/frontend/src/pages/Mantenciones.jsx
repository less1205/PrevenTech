import "../styles/mantenciones.css";
import "../styles/card.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { obtenerMantenciones, obtenerEquipos, obtenerUsuarios, crearMantencion } from "../services/api";

function Mantenciones() {
  const [mantenciones, setMantenciones] = useState([]);
  const [filtro, setFiltro] = useState("todos");

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [fechaInicioFiltro, setFechaInicioFiltro] = useState("");
  const [fechaFinFiltro, setFechaFinFiltro] = useState("");

  // NUEVOS ESTADOS: Control del modal y datos de los selectores
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [equipos, setEquipos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  
  // Estado para el formulario de la nueva mantención
  const [formData, setFormData] = useState({
    fecha: "",
    detalle: "",
    evidenciaUrl: "",
    proximaFecha: "",
    estado: "AL_DIA",
    equipoId: "",
    usuarioId: ""
  });

  // Función para cargar la lista de mantenciones desde la API
  const cargarMantenciones = () => {
    obtenerMantenciones()
      .then(data => setMantenciones(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    cargarMantenciones();
  }, []);

  // Cargar equipos y usuarios al abrir el modal para poblar los selectores
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
    if (estado === "AL_DIA") {
      return <span className="estado verde">Al día</span>;
    }
    if (estado === "PROXIMO") {
      return <span className="estado amarillo">Preventivo</span>;
    }
    if (estado === "VENCIDO") {
      return <span className="estado rojo">Crítico</span>;
    }
    return <span className="estado">-</span>;
  };

  // Manejar cambios en las cajas de texto y selectores
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar envío del formulario del modal hacia el backend
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Mapeamos el JSON construyendo los objetos anidados requeridos por las entidades JPA
    const payload = {
      fecha: formData.fecha,
      detalle: formData.detalle,
      evidenciaUrl: formData.evidenciaUrl || null,
      proximaFecha: formData.proximaFecha,
      estado: formData.estado,
      equipo: { id: parseInt(formData.equipoId) },
      usuario: { id: parseInt(formData.usuarioId) }
    };

    crearMantencion(payload)
      .then(() => {
        alert("¡Mantención registrada exitosamente!");
        setIsModalOpen(false); // Cerramos el modal
        // Limpiamos los campos del formulario
        setFormData({
          fecha: "",
          detalle: "",
          evidenciaUrl: "",
          proximaFecha: "",
          estado: "AL_DIA",
          equipoId: "",
          usuarioId: ""
        });
        cargarMantenciones(); // Refrescamos la tabla automáticamente
      })
      .catch(err => {
        console.error(err);
        alert("Ocurrió un error al guardar la mantención.");
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
      {/* SECCIÓN DEL ENCABEZADO CON EL NUEVO BOTÓN */}
      <div style={{ display: "flex", justifyContent: "between", alignItems: "center", width: "100%", marginBottom: "1rem" }}>
        <h1 style={{ margin: 0 }}>Mantenciones</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "14px",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
        >
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

        <button onClick={() => {
          setFechaInicioFiltro(fechaInicio);
          setFechaFinFiltro(fechaFin);
        }}>
          Filtrar
        </button>

        <button onClick={() => {
          setFechaInicio("");
          setFechaFin("");
          setFechaInicioFiltro("");
          setFechaFinFiltro("");
        }}>
          Limpiar
        </button>
      </div>

      <table className="tabla">
        <thead>
          <tr>
            <th>EQUIPO</th>
            <th>FECHA</th>
            <th>TIPO</th>
            <th>ESTADO</th>
            <th>PRÓXIMA</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(m => (
            <tr key={m.id}>
              <td>{m.equipo?.nombre}</td>
              <td>{m.fecha}</td>
              <td>Preventiva</td>
              <td>{badgeEstado(m.estado)}</td>
              <td>{m.proximaFecha || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ======================================================== */}
      {/* VISTA DEL MODAL EMERGENTE EN CAPAS TRASLÚCIDAS CSS       */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.52)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000,
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "520px",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15)",
            overflow: "hidden",
            color: "#334155",
            fontFamily: "sans-serif"
          }}>
            {/* Encabezado del Modal */}
            <div style={{
              backgroundColor: "#1e293b",
              color: "white",
              padding: "16px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Registrar Nueva Mantención</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "24px", cursor: "pointer", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleFormSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
              
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px" }}>Detalle del Trabajo</label>
                <textarea
                  name="detalle"
                  required
                  rows="3"
                  value={formData.detalle}
                  onChange={handleInputChange}
                  placeholder="Ej. Cambio de bujías y filtros de aceite..."
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", resize: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px" }}>Fecha Ejecución</label>
                  <input
                    type="date"
                    name="fecha"
                    required
                    value={formData.fecha}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px" }}>Próxima Fecha</label>
                  <input
                    type="date"
                    name="proximaFecha"
                    required
                    value={formData.proximaFecha}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px" }}>Equipo del Condominio</label>
                <select
                  name="equipoId"
                  required
                  value={formData.equipoId}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", backgroundColor: "white", boxSizing: "border-box" }}
                >
                  <option value="">-- Seleccione el Equipo --</option>
                  {equipos.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.nombre} - ({eq.ubicacion})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px" }}>Técnico Encargado</label>
                <select
                  name="usuarioId"
                  required
                  value={formData.usuarioId}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", backgroundColor: "white", boxSizing: "border-box" }}
                >
                  <option value="">-- Seleccione el Técnico --</option>
                  {usuarios.map(us => (
                    <option key={us.id} value={us.id}>{us.nombre} ({us.rol})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px" }}>Estado Inicial</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", backgroundColor: "white", boxSizing: "border-box" }}
                  >
                    <option value="AL_DIA">Al día</option>
                    <option value="PROXIMO">Preventivo</option>
                    <option value="VENCIDO">Crítico</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px" }}>Ruta Evidencia (Foto)</label>
                  <input
                    type="text"
                    name="evidenciaUrl"
                    value={formData.evidenciaUrl}
                    onChange={handleInputChange}
                    placeholder="evidencias/bomba.jpg"
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Botonera de acciones footer */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px", paddingTop: "14px", borderTop: "1px solid #e2e8f0" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: "8px 16px", border: "1px solid #cbd5e1", borderRadius: "6px", backgroundColor: "white", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", border: "none", borderRadius: "6px", backgroundColor: "#2563eb", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}
                >
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