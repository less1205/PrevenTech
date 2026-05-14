import { useEffect, useState } from "react";
import "../styles/alertas.css";

function Alertas() {

  const [alertas, setAlertas] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/alertas", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {

        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }

        return res.json();
      })
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

            <span>
              {a.tiempo || "Reciente"}
            </span>

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