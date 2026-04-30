import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const salir = () => {
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2 className="logo">PrevenTech</h2>

      <ul className="menu">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/equipos">Equipos</Link></li>
        <li><Link to="/mantenciones">Mantenciones</Link></li>
        <li><Link to="/alertas">Alertas</Link></li>
        <li><Link to="/usuarios">Usuarios</Link></li>
        <li onClick={salir}>Salir</li>
      </ul>
    </div>
  );
}

export default Sidebar;
