import "../styles/alertas.css";
import { useState } from "react";

function Mantenciones() {
  const [filtro, setFiltro] = useState("todos");

  // 👇 inputs (lo que escribe el usuario)
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // 👇 filtros aplicados (lo que realmente filtra)
  const [fechaInicioFiltro, setFechaInicioFiltro] = useState("");
  const [fechaFinFiltro, setFechaFinFiltro] = useState("");

  // 🔥 botón filtrar
  const aplicarFiltro = () => {
    setFechaInicioFiltro(fechaInicio);
    setFechaFinFiltro(fechaFin);
  };

  const limpiarFiltro = () => {
    setFechaInicio("");
    setFechaFin("");
    setFechaInicioFiltro("");
    setFechaFinFiltro("");
  };

  const equipos = [
    { nombre: "Compresor", estado: "vencido", fecha: "2026-03-10" },
    { nombre: "Motor", estado: "vencido", fecha: "2026-03-01" },
    { nombre: "Generador", estado: "vencido", fecha: "2026-02-15" },
    { nombre: "Bomba presión", estado: "vencido", fecha: "2026-01-20" },
    { nombre: "Turbina", estado: "vencido", fecha: "2026-02-01" },

    { nombre: "Bomba agua", estado: "proximo", fecha: "2026-04-20" },
    { nombre: "Ventilador industrial", estado: "proximo", fecha: "2026-04-25" },
    { nombre: "Sistema HVAC", estado: "proximo", fecha: "2026-04-28" },
    { nombre: "Caldera", estado: "proximo", fecha: "2026-04-30" },

    { nombre: "Panel solar", estado: "al_dia", fecha: "2026-05-20" },
    { nombre: "UPS", estado: "al_dia", fecha: "2026-06-10" },
    { nombre: "Servidor", estado: "al_dia", fecha: "2026-06-15" },
    { nombre: "Transformador", estado: "al_dia", fecha: "2026-07-01" },
    { nombre: "Iluminación planta", estado: "al_dia", fecha: "2026-07-10" },
  ];

  // 📊 CONTADORES
  const total = equipos.length;
  const vencidos = equipos.filter(e => e.estado === "vencido").length;
  const proximos = equipos.filter(e => e.estado === "proximo").length;
  const alDia = equipos.filter(e => e.estado === "al_dia").length;

  // ✅ FILTRO REAL (usa los filtros aplicados)
  const equiposFiltrados = equipos.filter(e => {
    const cumpleEstado =
      filtro === "todos" || e.estado === filtro;

    const fechaEquipo = new Date(e.fecha);
    const inicio = fechaInicioFiltro ? new Date(fechaInicioFiltro) : null;
    const fin = fechaFinFiltro ? new Date(fechaFinFiltro) : null;

    const cumpleFecha =
      (!inicio || fechaEquipo >= inicio) &&
      (!fin || fechaEquipo <= fin);

    return cumpleEstado && cumpleFecha;
  });

  return (
    <div className="reportes-container">

      <h1>Mantenciones</h1>

      {/* CARDS */}
      <div className="reportes-cards">
        <div className="card verde" onClick={() => setFiltro("al_dia")}>
          <span>Al día</span>
          <h2>{alDia}</h2>
        </div>

        <div className="card amarillo" onClick={() => setFiltro("proximo")}>
          <span>Próximas</span>
          <h2>{proximos}</h2>
        </div>

        <div className="card rojo" onClick={() => setFiltro("vencido")}>
          <span>Vencidas</span>
          <h2>{vencidos}</h2>
        </div>

        <div className="card" onClick={() => setFiltro("todos")}>
          <span>Total</span>
          <h2>{total}</h2>
        </div>
      </div>

      {/* FILTRO FECHA */}
      <div className="filtros">
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />

        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />

        <button onClick={aplicarFiltro}>
          Filtrar
        </button>

        <button onClick={limpiarFiltro}>
          Limpiar
        </button>
      </div>

      {/* TABLA */}
      <table className="tabla">
        <thead>
          <tr>
            <th>Equipo</th>
            <th>Fecha Mantención</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Próxima</th>
          </tr>
        </thead>

        <tbody>
          {equiposFiltrados.length === 0 ? (
            <tr>
              <td colSpan="5">No hay resultados</td>
            </tr>
          ) : (
            equiposFiltrados.map((equipo, index) => (
              <tr key={index}>
                <td>{equipo.nombre}</td>
                <td>{equipo.fecha}</td>
                <td>Preventiva</td>
                <td>
                  {equipo.estado === "vencido" && "🔴 Vencida"}
                  {equipo.estado === "proximo" && "🟡 Próxima"}
                  {equipo.estado === "al_dia" && "🟢 Al día"}
                </td>
                <td>-</td>
              </tr>
            ))
          )}
        </tbody>

      </table>

    </div>
  );
}

export default Mantenciones;
