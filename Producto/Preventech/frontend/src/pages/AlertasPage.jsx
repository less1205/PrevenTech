import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/alertas.css";
import { obtenerAlertas } from "../services/api";

const FILTROS = [
  { label: "Todas", value: "TODOS", claseActivo: "activo" },
  { label: "🔴 Crítico", value: "ROJO", claseActivo: "activo-critico" },
  { label: "🟡 Preventivo", value: "AMARILLO", claseActivo: "activo-preventivo" },
  { label: "🟢 Al día", value: "VERDE", claseActivo: "activo-ok" },
];

function mapTipo(color) {
  switch (color) {
    case "ROJO":
      return "critico";
    case "AMARILLO":
      return "preventivo";
    case "VERDE":
      return "ok";
    default:
      return "info";
  }
}

function labelTipo(color) {
  switch (color) {
    case "ROJO":
      return "Crítico";
    case "AMARILLO":
      return "Preventivo";
    case "VERDE":
      return "Al día";
    default:
      return "Info";
  }
}

function AlertasPage() {
  const [alertas, setAlertas] = useState([]);
  const [filtro, setFiltro] = useState("TODOS");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerAlertas()
      .then((data) => setAlertas(data))
      .catch((err) => console.error("Error cargando alertas:", err))
      .finally(() => setLoading(false));
  }, []);

  const alertasFiltradas =
    filtro === "TODOS"
      ? alertas
      : alertas.filter((a) => a.color === filtro);

  if (loading) {
    return <h2 style={{ padding: "30px", color: "#64748b" }}>Cargando alertas...</h2>;
  }

  return (
    <motion.div
      className="alertas-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22 }}
    >
      <h1 className="alertas-page-title">Alertas</h1>
      <p className="alertas-page-subtitle">
        Historial completo de alertas generadas por el sistema de mantenciones.
      </p>

      <div className="alertas-filtros">
        {FILTROS.map((f) => {
          const esActivo = filtro === f.value;
          const claseActivo = esActivo ? f.claseActivo : "";
          return (
            <button
              key={f.value}
              className={`filtro-btn ${claseActivo}`}
              onClick={() => setFiltro(f.value)}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <p className="alertas-count">
        {alertasFiltradas.length} alerta{alertasFiltradas.length !== 1 ? "s" : ""}
        {filtro !== "TODOS" ? ` · ${labelTipo(filtro)}` : ""}
      </p>

      <div className="alertas-lista">
        {alertasFiltradas.length === 0 ? (
          <p className="alertas-vacia">No hay alertas para mostrar.</p>
        ) : (
          alertasFiltradas.map((a) => (
            <div key={a.id} className={`alerta ${mapTipo(a.color)}`}>
              <div className="alerta-icono">
                {a.color === "ROJO" ? "🔴" : a.color === "AMARILLO" ? "🟡" : "🟢"}
              </div>
              <p>{a.mensaje}</p>
              <span>{a.fechaGenerada || "—"}</span>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

export default AlertasPage;