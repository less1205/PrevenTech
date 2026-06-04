import { useEffect, useState } from "react";
import "../styles/alertas.css";
import { obtenerAlertas } from "../services/api";

function Alertas() {

  const [alertas, setAlertas] = useState([]);

  useEffect(() => {

    obtenerAlertas()
      .then(data => setAlertas(data))
      .catch(error => {
        console.error("Error cargando alertas:", error);
      });

  }, []);

  return (
    <div className="alertas">

      <h3>Alertas Recientes</h3>

      {alertas.length === 0 ? (

        <p>No hay alertas</p>

      ) : (

        alertas.map((a) => (

          <div
            key={a.id}
            className={`alerta ${mapTipo(a.color)}`}
          >

            <p>{a.mensaje}</p>

            <span>Reciente</span>

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

export default Alertas;