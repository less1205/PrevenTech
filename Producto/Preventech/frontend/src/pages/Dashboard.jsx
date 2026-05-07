import { useEffect, useState } from "react";

import "../styles/dashboard.css";

import Card from "../components/Card";
import Grafico from "../components/Grafico";
import Alertas from "../components/Alertas";

function Dashboard() {

  const [mantenciones, setMantenciones] = useState([]);

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

    }
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

  const datosGrafico = [

    {
      name: "Vencidos",
      value: vencidos
    },

    {
      name: "Próximos",
      value: proximos
    },

    {
      name: "Al día",
      value: alDia
    }

  ];

  return (

    <div className="dashboard-container container-fluid p-4">

      <h1 className="dashboard-title mb-2">
        Panel de Control
      </h1>

      <p className="dashboard-subtitle mb-4">
        Resumen general de mantenciones
      </p>

      <div className="row g-4 mb-4">

        <div className="col-12 col-sm-6 col-xl-3">

          <Card
            titulo="Total"
            numero={total}
            color="gris"
            badge="Mantenciones"
            icono="⚙️"
          />

        </div>

        <div className="col-12 col-sm-6 col-xl-3">

          <Card
            titulo="Vencidas"
            numero={vencidos}
            color="rojo"
            badge="Estado"
            icono="🔴"
          />

        </div>

        <div className="col-12 col-sm-6 col-xl-3">

          <Card
            titulo="Próximas"
            numero={proximos}
            color="naranja"
            badge="Estado"
            icono="🟡"
          />

        </div>

        <div className="col-12 col-sm-6 col-xl-3">

          <Card
            titulo="Al día"
            numero={alDia}
            color="verde"
            badge="Estado"
            icono="🟢"
          />

        </div>

      </div>

      <div className="row g-4">

        <div className="col-12 col-lg-5">

          <div className="panel p-4 h-100">

            <Grafico datos={datosGrafico} />

          </div>

        </div>

        <div className="col-12 col-lg-7">

          <div className="panel p-4 h-100">

            <Alertas />

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;