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

  useEffect(() => {
    obtenerEquipos();
  }, []);

  const obtenerEquipos = async () => {
    try {
      const data = await obtenerEquiposApi();
      setListaEquipos(data);
    } catch (error) {
      console.error("Error cargando equipos:", error);
    } finally {
      setLoading(false);
    }
  };

  // FUNCIÓN MODIFICADA: Ahora incluye confirmación previa y avisos visuales
  const eliminarEquipo = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este equipo? Se borrará también todo su historial de mantenciones de forma permanente."
    );

    if (!confirmar) return;

    try {
      await eliminarEquipoApi(id);
      alert("¡Equipo eliminado exitosamente!");
      obtenerEquipos(); // Recarga la tabla de inmediato
    } catch (error) {
      console.error("Error eliminando equipo:", error);
      alert("Ocurrió un error al intentar eliminar el equipo. Revisa la consola.");
    }
  };

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

  const equiposFiltrados = listaEquipos.filter((e) => {
    const coincideBusqueda =
      (e.nombre || "")
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      (e.tipo || "")
        .toLowerCase()
        .includes(busqueda.toLowerCase());

    
    const estado = (e.estado || "").toUpperCase();
    const coincideFiltro = filtro === "todos" || estado === filtro;

    return coincideBusqueda && coincideFiltro;
  });

  if (loading) {
    return <h2 className="loading">Cargando equipos...</h2>;
  }

  return (
    <motion.div
      className="equipos-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22 }}
    >

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
        
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
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
            <tr>
              <td colSpan="5">No hay equipos</td>
            </tr>
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
                    onClick={() => eliminarEquipo(equipo.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </motion.div>
  );
}

export default Equipos;