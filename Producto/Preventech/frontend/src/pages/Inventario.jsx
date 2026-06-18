import { useEffect, useState } from "react";
import "../styles/inventario.css";
import { motion } from "framer-motion";
import { obtenerEquipos, crearEquipo, obtenerMantenciones } from "../services/api"; 

function Inventario() {
  const [equipos, setEquipos] = useState([]);
  const [mantenciones, setMantenciones] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);

  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: "",
    tipo: "MECANICOS",
    ubicacion: ""
  });

  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroUbicacion, setFiltroUbicacion] = useState("todos");

  useEffect(() => {
    obtenerDatosInventario();
  }, []);

  const obtenerDatosInventario = async () => {
    try {
      const [dataEquipos, dataMantenciones] = await Promise.all([
        obtenerEquipos(),
        obtenerMantenciones()
      ]);

      setEquipos(dataEquipos);
      setMantenciones(dataMantenciones);
    } catch (error) {
      console.error("Error cargando datos del inventario:", error);
    } finally {
      setLoading(false);
    }
  };

  const guardarEquipo = async () => {
    try {
      await crearEquipo({
        nombre: nuevoEquipo.nombre,
        tipo: nuevoEquipo.tipo,
        ubicacion: nuevoEquipo.ubicacion,
        estado: "AL_DIA"
      });

      setMostrarModal(false);
      setNuevoEquipo({
        nombre: "",
        tipo: "MECANICOS",
        ubicacion: ""
      });

      obtenerDatosInventario();
    } catch (error) {
      console.error(error);
      alert("Error al guardar equipo");
    }
  };

  const obtenerUltimaFechaMantencion = (equipoId) => {
    const mantencionesDelEquipo = mantenciones.filter(
      (m) => m.equipo && m.equipo.id === equipoId
    );

    if (mantencionesDelEquipo.length === 0) return "-";

    const ordenadas = mantencionesDelEquipo.sort(
      (a, b) => new Date(b.fecha) - new Date(a.fecha)
    );

    return ordenadas[0].fecha; 
  };

  const equiposFiltrados = equipos.filter((e) => {
    const estado = (e.estado || "").toLowerCase();
    const categoria = (e.tipo || "").toLowerCase();
    const ubicacion = (e.ubicacion || "").toLowerCase();

    const cumpleEstado = filtroEstado === "todos" || estado === filtroEstado;
    const cumpleCategoria = filtroCategoria === "todos" || categoria === filtroCategoria;
    const cumpleUbicacion = filtroUbicacion === "todos" || ubicacion === filtroUbicacion;

    return cumpleEstado && cumpleCategoria && cumpleUbicacion;
  });

  const estadosUnicos = [
    ...new Set(equipos.map(e => (e.estado || "").toLowerCase()))
  ];

  const categoriasUnicas = [
    ...new Set(equipos.map(e => (e.tipo || "").toLowerCase()))
  ];

  const ubicacionesUnicas = [
    ...new Set(equipos.map(e => (e.ubicacion || "").toLowerCase()))
  ];

  const badgeEstado = (estado) => {
    if (estado === "AL_DIA") return <span className="estado verde">Al día</span>;
    if (estado === "PROXIMO") return <span className="estado amarillo">Preventivo</span>;
    if (estado === "VENCIDO") return <span className="estado rojo">Crítico</span>;
    return <span className="estado">-</span>;
  };

  if (loading) {
    return <h2>Cargando inventario...</h2>;
  }

  return (
    <motion.div
      className="inventario-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22 }}
    >

      <div className="inventario-header">
        <div>
          <h1>Gestión de Inventario</h1>
          <p>Administra todos los equipos del condominio</p>
        </div>
        <button className="btn-agregar" onClick={() => setMostrarModal(true)}>
          + Agregar Nuevo Equipo
        </button>
      </div>

      <div className="filtros">
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
          <option value="todos">Todas las Categorías</option>
          {categoriasUnicas.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="todos">Todos los Estados</option>
          {estadosUnicos.map((e, i) => (
            <option key={i} value={e}>{e}</option>
          ))}
        </select>

        <select value={filtroUbicacion} onChange={(e) => setFiltroUbicacion(e.target.value)}>
          <option value="todos">Todas las Ubicaciones</option>
          {ubicacionesUnicas.map((u, i) => (
            <option key={i} value={u}>{u}</option>
          ))}
        </select>
      </div>

      <div className="tabla-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOMBRE DEL EQUIPO</th>
              <th>CATEGORÍA</th>
              <th>UBICACIÓN</th>
              <th>ÚLTIMA MANTENCIÓN</th>
              <th>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {equiposFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6">No hay equipos</td>
              </tr>
            ) : (
              equiposFiltrados.map((e) => (
                <tr key={e.id}>
                  <td>#{e.id}</td>
                  <td>{e.nombre}</td>
                  <td>{e.tipo}</td>
                  <td>{e.ubicacion}</td>
                  <td>{obtenerUltimaFechaMantencion(e.id)}</td>
                  <td>{badgeEstado(e.estado)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL PARA AGREGAR EQUIPO */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            
            <div className="modal-header">
              <h3>Registrar Nuevo Equipo</h3>
              <button className="modal-close-btn" onClick={() => setMostrarModal(false)}>&times;</button>
            </div>

            <div className="modal-form">
              <div className="form-group">
                <label>Nombre del Equipo</label>
                <input
                  type="text"
                  placeholder="Ej. Bomba de agua principal"
                  value={nuevoEquipo.nombre}
                  onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, nombre: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Categoría / Tipo</label>
                <select
                  value={nuevoEquipo.tipo}
                  onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, tipo: e.target.value })}
                >
                  <option value="MECANICOS">Mecánicos</option>
                  <option value="ROTATIVOS">Rotativos</option>
                  <option value="ELECTRICOS">Eléctricos</option>
                  <option value="ESTATICOS">Estáticos</option>
                  <option value="INSTRUMENTACION">Instrumentación</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ubicación</label>
                <input
                  type="text"
                  placeholder="Ej. Subterráneo Torre A"
                  value={nuevoEquipo.ubicacion}
                  onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, ubicacion: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn-guardar" onClick={guardarEquipo}>
                  Guardar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </motion.div>
  );
}

export default Inventario;