import { useEffect, useState } from "react";
import "../styles/equipos.css";
import { motion } from "framer-motion";

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

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/equipos", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      setListaEquipos(data);

    } catch (error) {

      console.error("Error cargando equipos:", error);

    } finally {

      setLoading(false);
    }
  };

  const eliminarEquipo = async (id) => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/equipos/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      obtenerEquipos();

    } catch (error) {

      console.error("Error eliminando equipo:", error);
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

    const estado = (e.estado || "").toLowerCase();

    const coincideFiltro =
      filtro === "todos" || estado === filtro;

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

        <button onClick={() => setFiltro("todos")}>
          Todos
        </button>

        <button onClick={() => setFiltro("al_dia")}>
          🟢 Al día
        </button>

        <button onClick={() => setFiltro("proximo")}>
          🟡 Preventivo
        </button>

        <button onClick={() => setFiltro("vencido")}>
          🔴 Crítico
        </button>

      </div>

      <table className="tabla">

        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Ubicación</th>
            <th>Estado</th>
            <th>Acciones</th>
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