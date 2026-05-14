import "../styles/mantenciones.css";
import "../styles/card.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Mantenciones() {
  const [mantenciones, setMantenciones] = useState([]);
  const [filtro, setFiltro] = useState("todos");

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [fechaInicioFiltro, setFechaInicioFiltro] = useState("");
  const [fechaFinFiltro, setFechaFinFiltro] = useState("");

  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/mantenciones", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        return res.json();
      })
      .then(data => setMantenciones(data))
      .catch(err => console.error(err));

  }, []);

  const total = mantenciones.length;
  const vencidos = mantenciones.filter(m => m.estado === "VENCIDO").length;
  const proximos = mantenciones.filter(m => m.estado === "PROXIMO").length;
  const alDia = mantenciones.filter(m => m.estado === "AL_DIA").length;

  const filtrados = mantenciones.filter(m => {
    const cumpleEstado =
      filtro === "todos" || m.estado === filtro;

    const fecha = new Date(m.fecha);
    const inicio = fechaInicioFiltro ? new Date(fechaInicioFiltro) : null;
    const fin = fechaFinFiltro ? new Date(fechaFinFiltro) : null;

    const cumpleFecha =
      (!inicio || fecha >= inicio) &&
      (!fin || fecha <= fin);

    return cumpleEstado && cumpleFecha;
  });

  const badgeEstado = (estado) => {
    if (estado === "AL_DIA") return <span className="estado verde">Al día</span>;
    if (estado === "PROXIMO") return <span className="estado amarillo">Preventivo</span>;
    if (estado === "VENCIDO") return <span className="estado rojo">Crítico</span>;
    return <span className="estado">-</span>;
  };

  return (
    <motion.div
      className="reportes-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22 }}
    >

      <h1>Mantenciones</h1>

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
            <th>Equipo</th>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Próxima</th>
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

    </motion.div>
  );
}

export default Mantenciones;