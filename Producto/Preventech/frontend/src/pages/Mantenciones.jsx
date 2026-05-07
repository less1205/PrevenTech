import { useEffect, useState } from "react";
import "../styles/mantenciones.css";

function Mantenciones() {

  const [filtro, setFiltro] = useState("todos");

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [fechaInicioFiltro, setFechaInicioFiltro] = useState("");
  const [fechaFinFiltro, setFechaFinFiltro] = useState("");

  const [mantenciones, setMantenciones] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerMantenciones();
  }, []);

  const obtenerMantenciones = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/api/mantenciones"
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      setMantenciones(data);

    } catch (error) {

      console.error(
        "Error cargando mantenciones:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  const aplicarFiltro = () => {

    setFechaInicioFiltro(fechaInicio);
    setFechaFinFiltro(fechaFin);

  };

  const limpiarFiltro = () => {

    setFechaInicio("");
    setFechaFin("");

    setFechaInicioFiltro("");
    setFechaFinFiltro("");

    setFiltro("todos");

  };

  const total = mantenciones.length;

  const vencidos = mantenciones.filter(
    (m) => m.estado === "VENCIDO"
  ).length;

  const proximos = mantenciones.filter(
    (m) => m.estado === "PROXIMO"
  ).length;

  const alDia = mantenciones.filter(
    (m) => m.estado === "AL_DIA"
  ).length;

  const mantencionesFiltradas = mantenciones.filter((m) => {

    const estado = (m.estado || "").toUpperCase();

    const cumpleEstado =
      filtro === "todos" ||
      estado === filtro;

    const fechaMantencion = m.fecha
      ? new Date(m.fecha)
      : null;

    const inicio = fechaInicioFiltro
      ? new Date(fechaInicioFiltro)
      : null;

    const fin = fechaFinFiltro
      ? new Date(fechaFinFiltro)
      : null;

    const cumpleFecha =
      (!inicio || !fechaMantencion || fechaMantencion >= inicio) &&
      (!fin || !fechaMantencion || fechaMantencion <= fin);

    return cumpleEstado && cumpleFecha;

  });

  if (loading) {
    return <h2>Cargando mantenciones...</h2>;
  }

  return (

    <div className="mantenciones-container container-fluid p-4">

      <h1 className="mb-4">
        Mantenciones
      </h1>

      <div className="mantenciones-cards mb-4">

        <div
          className="mantencion-card verde"
          onClick={() => setFiltro("AL_DIA")}
        >

          <span>Al día</span>

          <h2>{alDia}</h2>

        </div>

        <div
          className="mantencion-card amarillo"
          onClick={() => setFiltro("PROXIMO")}
        >

          <span>Próximas</span>

          <h2>{proximos}</h2>

        </div>

        <div
          className="mantencion-card rojo"
          onClick={() => setFiltro("VENCIDO")}
        >

          <span>Vencidas</span>

          <h2>{vencidos}</h2>

        </div>

        <div
          className="mantencion-card"
          onClick={() => setFiltro("todos")}
        >

          <span>Total</span>

          <h2>{total}</h2>

        </div>

      </div>

      <div className="filtros">

        <input
          type="date"
          value={fechaInicio}
          onChange={(e) =>
            setFechaInicio(e.target.value)
          }
        />

        <input
          type="date"
          value={fechaFin}
          onChange={(e) =>
            setFechaFin(e.target.value)
          }
        />

        <button onClick={aplicarFiltro}>
          Filtrar
        </button>

        <button onClick={limpiarFiltro}>
          Limpiar
        </button>

      </div>

      <table className="tabla">

        <thead>

          <tr>

            <th>Equipo</th>
            <th>Fecha</th>
            <th>Detalle</th>
            <th>Estado</th>
            <th>Próxima</th>
            <th>Técnico</th>

          </tr>

        </thead>

        <tbody>

          {mantencionesFiltradas.length === 0 ? (

            <tr>

              <td colSpan="6">
                No hay resultados
              </td>

            </tr>

          ) : (

            mantencionesFiltradas.map((mantencion) => (

              <tr key={mantencion.id}>

                <td>

                  {mantencion.equipo?.nombre}

                </td>

                <td>

                  {mantencion.fecha}

                </td>

                <td>

                  {mantencion.detalle}

                </td>

                <td>

                  {mantencion.estado === "VENCIDO" &&
                    "🔴 Vencido"}

                  {mantencion.estado === "PROXIMO" &&
                    "🟡 Próximo"}

                  {mantencion.estado === "AL_DIA" &&
                    "🟢 Al día"}

                </td>

                <td>

                  {mantencion.proximaFecha}

                </td>

                <td>

                  {mantencion.usuario?.nombre}

                </td>

              </tr>

            ))
          )}

        </tbody>

      </table>

    </div>
  );
}

export default Mantenciones;