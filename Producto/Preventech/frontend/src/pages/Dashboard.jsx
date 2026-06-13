import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import Card from "../components/Card";
import Grafico from "../components/Grafico";
import Alertas from "../components/Alertas";
import { motion } from "framer-motion";
import { obtenerEquipos, obtenerMantenciones } from "../services/api";

function getSaludo() {
  const hora = new Date().getHours();
  if (hora >= 6 && hora < 13) return "Buenos días";
  if (hora >= 13 && hora < 20) return "Buenas tardes";
  return "Buenas noches";
}

function getFechaLarga() {
  return new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Dashboard() {
  const [equipos, setEquipos] = useState([]);
  const [mantenciones, setMantenciones] = useState([]);

  const nombre = localStorage.getItem("nombre") || "Usuario";

  useEffect(() => {
    obtenerEquipos()
      .then((data) => setEquipos(data))
      .catch((err) => console.error(err));

    obtenerMantenciones()
      .then((data) => setMantenciones(data))
      .catch((err) => console.error(err));
  }, []);

  const total = equipos.length;
  const criticos = equipos.filter((e) => e.estado === "VENCIDO").length;
  const preventivos = equipos.filter((e) => e.estado === "PROXIMO").length;
  const alDia = equipos.filter((e) => e.estado === "AL_DIA").length;

  const pieData = [
    { name: "Al día", value: alDia },
    { name: "Próximo", value: preventivos },
    { name: "Vencido", value: criticos },
  ];

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const proximasMantenciones = mantenciones
    .filter((m) => m.proximaFecha)
    .map((m) => ({ ...m, _fecha: new Date(m.proximaFecha) }))
    .filter((m) => m._fecha >= hoy)
    .sort((a, b) => a._fecha - b._fecha)
    .slice(0, 5);

  const diasRestantes = (fecha) => {
    const diff = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
    if (diff === 0) return { label: "Hoy", clase: "urgente" };
    if (diff === 1) return { label: "Mañana", clase: "urgente" };
    if (diff <= 7) return { label: `En ${diff} días`, clase: "proximo" };
    return { label: `En ${diff} días`, clase: "ok" };
  };

  return (
    <div className="dashboard-container">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.22 }}
      >
        <div className="dashboard-saludo">
          <div>
            <h1 className="dashboard-title">
              {getSaludo()}, {nombre.split(" ")[0]} 👋
            </h1>
            <p className="dashboard-subtitle">{getFechaLarga()}</p>
          </div>
        </div>

        <div className="cards-grid">
          <Card titulo="Total Equipos" numero={total}      color="gris"    badge="Total"       icono="⚙️" />
          <Card titulo="Críticos"      numero={criticos}   color="rojo"    badge="Críticos"    icono="⚠️" />
          <Card titulo="Preventivos"   numero={preventivos} color="naranja" badge="Preventivos" icono="🔧" />
          <Card titulo="Al día"        numero={alDia}      color="verde"   badge="Al día"      icono="✅" />
        </div>

        <div className="dashboard-bottom">
          <div className="panel grafico-panel">
            <Grafico data={pieData} />
          </div>
          <div className="panel">
            <Alertas />
          </div>
        </div>

        <div className="panel proximas-panel">
          <h3 className="panel-title">📅 Próximas Mantenciones</h3>

          {proximasMantenciones.length === 0 ? (
            <p className="proximas-vacio">No hay mantenciones próximas programadas.</p>
          ) : (
            <table className="proximas-tabla">
              <thead>
                <tr>
                  <th>Equipo</th>
                  <th>Tipo</th>
                  <th>Fecha programada</th>
                  <th>Tiempo restante</th>
                </tr>
              </thead>
              <tbody>
                {proximasMantenciones.map((m) => {
                  const { label, clase } = diasRestantes(m._fecha);
                  return (
                    <tr key={m.id}>
                      <td>{m.equipo?.nombre || "—"}</td>
                      <td>{m.equipo?.tipo || "—"}</td>
                      <td>{m._fecha.toLocaleDateString("es-CL")}</td>
                      <td>
                        <span className={`dias-badge ${clase}`}>{label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </motion.div>
    </div>
  );
}

export default Dashboard;