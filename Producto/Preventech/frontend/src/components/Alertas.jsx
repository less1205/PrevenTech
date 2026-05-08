import { useEffect, useState } from "react";
import "../styles/alertas.css";

function Alertas() {

  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/alertas")
      .then(res => res.json())
      .then(data => setAlertas(data));
  }, []);

  return (
    <div className="alertas">
      <h3>Alertas Recientes</h3>

      {alertas.map((a) => (
        <div key={a.id} className={`alerta ${mapTipo(a.color)}`}>
          <p>{a.mensaje}</p>
          <span>{a.tiempo || "Reciente"}</span>
        </div>
      ))}

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

export default Alertas;