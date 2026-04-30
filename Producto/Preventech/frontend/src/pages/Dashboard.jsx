import "../styles/dashboard.css";
import Card from "../components/Card";

function Dashboard() {
  return (
    <div className="dashboard-container">

      <h1 className="dashboard-title">
        Dashboard PrevenTech
      </h1>

      <div className="cards-grid">
        <Card titulo="Equipos" numero="25" />
        <Card titulo="Vencidas" numero="4" />
        <Card titulo="Próximas" numero="8" />
        <Card titulo="Técnicos" numero="3" />
      </div>

    </div>
  );
}

export default Dashboard;
