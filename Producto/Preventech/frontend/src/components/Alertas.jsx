import { useEffect, useState } from "react";

import "../styles/alertas.css";

function Alertas() {

  const [alertas, setAlertas] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerAlertas();
  }, []);

  const obtenerAlertas = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/api/alertas"
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      setAlertas(data);

    } catch (error) {

      console.error(
        "Error cargando alertas:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return <p>Cargando alertas...</p>;
  }

  return (

    <div className="alertas">

      <h3 className="mb-4">
        Alertas Recientes
      </h3>

      {alertas.length === 0 ? (

        <p>No hay alertas</p>

      ) : (

        alertas.map((alerta) => (

          <div
            key={alerta.id}
            className={`alerta ${alerta.color?.toLowerCase()}`}
          >

            <p>

              {alerta.mensaje}

            </p>

            <span>

              {alerta.mantencion?.equipo?.nombre}

            </span>

          </div>

        ))
      )}

    </div>
  );
}

export default Alertas;