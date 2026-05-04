import "../styles/dashboard.css";
import Card from "../components/Card";
import Grafico from "../components/Grafico";
import Alertas from "../components/Alertas";

function Dashboard() {
  return (
    <div className="dashboard-container">

      <h1 className="dashboard-title">
        Panel de Control
      </h1>

      <div className="cards-grid">
        <Card titulo="Total Equipos" numero="150" color="gris" badge="Total" icono={"⚙️"} />
        <Card titulo="Críticos" numero="8" color="rojo" badge="Críticos" icono={"⚠️"} />
        <Card titulo="Preventivos" numero="23" color="naranja" badge="Preventivos" icono={"🔧"} />
        <Card titulo="Al día" numero="119" color="verde" badge="Al día" icono={"✅"} />
      </div>
      <div className="dashboard-bottom">
        <div className="panel">
          <Grafico />
        </div>

        <div className="panel">
          <Alertas />
        </div>
          
      </div>

    </div>
  );
}

export default Dashboard;
