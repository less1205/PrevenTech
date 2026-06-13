import { useEffect, useState } from "react";
import "../styles/equipos.css";
import { motion } from "framer-motion"; 
import {
  obtenerEquipos as obtenerEquiposApi,
  eliminarEquipo as eliminarEquipoApi
} from "../services/api";

function Equipos() {

  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [listaEquipos, setListaEquipos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [equipoAEliminar, setEquipoAEliminar] = useState(null);
  const [textoConfirmacion, setTextoConfirmacion] = useState("");

  const [mostrarError, setMostrarError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    obtenerEquipos();
  }, []);

  const mostrarAlertaError = (mensaje) => {
    setMensajeError(mensaje || "Ha ocurrido un error");
    setMostrarError(true);
    setTimeout(() => setMostrarError(false), 4000);
  };

  const obtenerEquipos = async () => {
    try {
      const data = await obtenerEquiposApi();
      setListaEquipos(data);
    } catch (error) {
      console.error("Error cargando equipos:", error);
      mostrarAlertaError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalEliminar = (equipo) => {
    setEquipoAEliminar(equipo);
    setTextoConfirmacion("");
    setMostrarModalEliminar(true);
  };

  const cerrarModal = () => {
    setMostrarModalEliminar(false);
    setEquipoAEliminar(null);
    setTextoConfirmacion("");
  };

  const eliminarEquipo = async () => {
    if (textoConfirmacion.trim() !== "ELIMINAR") {
      mostrarAlertaError("Debe escribir ELIMINAR para continuar");
      return;
    }

    try {
      await eliminarEquipoApi(equipoAEliminar.id);
      cerrarModal();
      obtenerEquipos();
    } catch (error) {
      console.error("Error eliminando equipo:", error);
      mostrarAlertaError(error?.message);
    }
  };

  const badgeEstado = (estado) => {
    if (estado === "AL_DIA") return <span className="estado verde">Al día</span>;
    if (estado === "PROXIMO") return <span className="estado amarillo">Preventivo</span>;
    if (estado === "VENCIDO") return <span className="estado rojo">Crítico</span>;
    return <span className="estado">-</span>;
  };

  const equiposFiltrados = listaEquipos.filter((e) => {
    const coincideBusqueda =
      (e.nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (e.tipo || "").toLowerCase().includes(busqueda.toLowerCase());
    const estado = (e.estado || "").toUpperCase();
    const coincideFiltro = filtro === "todos" || estado === filtro;
    return coincideBusqueda && coincideFiltro;
  });

  if (loading) return <h2 className="loading">Cargando equipos...</h2>;

  return (
    <motion.div
      className="equipos-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22 }}
    >

      {mostrarError && (
        <div className="alerta-error">{mensajeError}</div>
      )}

      <div className="equipos-header">
        <h1>Equipos</h1>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre o tipo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="buscador"
      />

      <div className="filtros">
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="todos">Todos los Estados</option>
          <option value="AL_DIA">🟢 Al día</option>
          <option value="PROXIMO">🟡 Preventivo</option>
          <option value="VENCIDO">🔴 Crítico</option>
        </select>
      </div>

      <table className="tabla">
        <thead>
          <tr>
            <th>NOMBRE</th>
            <th>TIPO</th>
            <th>UBICACIÓN</th>
            <th>ESTADO</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {equiposFiltrados.length === 0 ? (
            <tr><td colSpan="5">No hay equipos</td></tr>
          ) : (
            equiposFiltrados.map((equipo) => (
              <tr key={equipo.id}>
                <td>{equipo.nombre}</td>
                <td>{equipo.tipo}</td>
                <td>{equipo.ubicacion}</td>
                <td>{badgeEstado(equipo.estado)}</td>
                <td>
                  <button
                    className="eliminar"
                    onClick={() => abrirModalEliminar(equipo)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {mostrarModalEliminar && (
        <div className="modal-overlay">
          <div className="modal-eliminar">

            <h2>Eliminar Equipo</h2>

            <p>Está a punto de eliminar el siguiente equipo:</p>

            <strong>{equipoAEliminar?.nombre}</strong>

            <p className="texto-warning">
              Esta acción es permanente y eliminará también todo el historial de mantenciones.
            </p>

            <p>Para continuar escriba:<strong> ELIMINAR</strong></p>

            <input
              type="text"
              placeholder="Escriba ELIMINAR"
              value={textoConfirmacion}
              onChange={(e) => setTextoConfirmacion(e.target.value)}
            />

            <div className="modal-botones">
              <button className="btn-cancelar" onClick={cerrarModal}>
                Cancelar
              </button>
              <button className="btn-confirmar-eliminar" onClick={eliminarEquipo}>
                Eliminar Equipo
              </button>
            </div>

          </div>
        </div>
      )}

    </motion.div>
  );
}

export default Equipos;