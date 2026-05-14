import { useEffect, useState } from "react";
import "../styles/inventario.css";
import { motion } from "framer-motion";

function Inventario() {

  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroUbicacion, setFiltroUbicacion] = useState("todos");

  useEffect(() => {
    obtenerEquipos();
  }, []);

  const obtenerEquipos = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/equipos", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();

      setEquipos(data);

    } catch (error) {

      console.error("Error cargando inventario:", error);

    } finally {

      setLoading(false);
    }
  };

  const equiposFiltrados = equipos.filter((e) => {

    const estado = (e.estado || "").toLowerCase();

    const categoria = (e.tipo || "").toLowerCase();

    const ubicacion = (e.ubicacion || "").toLowerCase();

    const cumpleEstado =
      filtroEstado === "todos" || estado === filtroEstado;

    const cumpleCategoria =
      filtroCategoria === "todos" || categoria === filtroCategoria;

    const cumpleUbicacion =
      filtroUbicacion === "todos" || ubicacion === filtroUbicacion;

    return (
      cumpleEstado &&
      cumpleCategoria &&
      cumpleUbicacion
    );
  });

  const estadosUnicos = [
    ...new Set(
      equipos.map(e => (e.estado || "").toLowerCase())
    )
  ];

  const categoriasUnicas = [
    ...new Set(
      equipos.map(e => (e.tipo || "").toLowerCase())
    )
  ];

  const ubicacionesUnicas = [
    ...new Set(
      equipos.map(e => (e.ubicacion || "").toLowerCase())
    )
  ];

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

          <p>
            Administra todos los equipos del condominio
          </p>
        </div>

        <button className="btn-agregar">
          + Añadir Nuevo Equipo
        </button>

      </div>

      <div className="filtros">

        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >

          <option value="todos">
            Todas las Categorías
          </option>

          {categoriasUnicas.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}

        </select>

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >

          <option value="todos">
            Todos los Estados
          </option>

          {estadosUnicos.map((e, i) => (
            <option key={i} value={e}>
              {e}
            </option>
          ))}

        </select>

        <select
          value={filtroUbicacion}
          onChange={(e) => setFiltroUbicacion(e.target.value)}
        >

          <option value="todos">
            Todas las Ubicaciones
          </option>

          {ubicacionesUnicas.map((u, i) => (
            <option key={i} value={u}>
              {u}
            </option>
          ))}

        </select>

      </div>

      <div className="tabla-container">

        <table>

          <thead>

            <tr>
              <th>ID</th>
              <th>Nombre del Equipo</th>
              <th>Categoría</th>
              <th>Ubicación</th>
              <th>Última Mantención</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>

          </thead>

          <tbody>

            {equiposFiltrados.length === 0 ? (

              <tr>
                <td colSpan="7">No hay equipos</td>
              </tr>

            ) : (

              equiposFiltrados.map((e) => (

                <tr key={e.id}>

                  <td>#{e.id}</td>

                  <td>{e.nombre}</td>

                  <td>{e.tipo}</td>

                  <td>{e.ubicacion}</td>

                  <td>{e.ultimaMantencion || "-"}</td>

                  <td>{badgeEstado(e.estado)}</td>

                  <td>⋯</td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </motion.div>
  );
}

export default Inventario;