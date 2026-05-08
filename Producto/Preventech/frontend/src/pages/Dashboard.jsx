import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import Card from "../components/Card";
import Grafico from "../components/Grafico";
import Alertas from "../components/Alertas";
import { motion } from "framer-motion";

function Dashboard() {

  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/equipos")
      .then(res => res.json())
      .then(data => setEquipos(data));
  }, []);

  const total = equipos.length;
  const criticos = equipos.filter(e => e.estado === "VENCIDO").length;
  const preventivos = equipos.filter(e => e.estado === "PROXIMO").length;
  const alDia = equipos.filter(e => e.estado === "AL_DIA").length;

  const pieData = [
    { name: "Al día", value: alDia },
    { name: "Próximo", value: preventivos },
    { name: "Vencido", value: criticos }
  ];

  return (
    <div className="dashboard-container">

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
      >

        <h1 className="dashboard-title">
          Panel de Control
        </h1>

        <div className="cards-grid">

          <Card
            titulo="Total Equipos"
            numero={total}
            color="gris"
            badge="Total"
            icono="⚙️"
          />

          <Card
            titulo="Críticos"
            numero={criticos}
            color="rojo"
            badge="Críticos"
            icono="⚠️"
          />

          <Card
            titulo="Preventivos"
            numero={preventivos}
            color="naranja"
            badge="Preventivos"
            icono="🔧"
          />

          <Card
            titulo="Al día"
            numero={alDia}
            color="verde"
            badge="Al día"
            icono="✅"
          />

        </div>

        <div className="dashboard-bottom">

          <div className="panel">
            <Grafico data={pieData} />
          </div>

          <div className="panel">
            <Alertas />
          </div>

        </div>

      </motion.div>

    </div>
  );
}

export default Dashboard;