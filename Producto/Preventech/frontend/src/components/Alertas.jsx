import { useEffect, useState } from "react";
import "../styles/alertas.css";
import { obtenerAlertasRecientes } from "../services/api";
import { useNavigate } from "react-router-dom";

function Alertas() {
  const [alertas, setAlertas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerAlertasRecientes()
      .then((data) => setAlertas(data.slice(0, 5)))
      .catch((error) => {
        console.error("Error cargando alertas:", error);
      });
  }, []);

  return (
    <div className="alertas">
      <div className="alertas-header">
        <h3>Alertas Recientes</h3>
        <button className="ver-todas-btn" onClick={() => navigate("/alertas")}>
          Ver todas →
        </button>
      </div>

      {alertas.length === 0 ? (
        <p>No hay alertas</p>
      ) : (
        alertas.map((a) => (
          <div key={a.id} className={`alerta ${mapTipo(a.color)}`}>
            <div className="alerta-icono">{iconoPorTipo(a.color)}</div>
            <p>{a.mensaje}</p>
            <span>{a.fechaGenerada || "Reciente"}</span>
          </div>
        ))
      )}
    </div>
  );
}

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

function iconoPorTipo(color) {
  switch (color) {
    case "ROJO":
      return "🔴";
    case "AMARILLO":
      return "🟡";
    case "VERDE":
      return "🟢";
    default:
      return "🔵";
  }
}

export default Alertas;