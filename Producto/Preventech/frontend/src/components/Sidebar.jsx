import { NavLink, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {

  const navigate = useNavigate();

  const nombre =
    localStorage.getItem("nombre") || "Usuario";

  const rol =
    localStorage.getItem("rol") || "Sin rol";

  const iniciales = nombre
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (

    <div className="sidebar">

      <div className="logo">

        <div className="logo-icon">
          🏢
        </div>

        <div>
          <h2>PrevenTech</h2>
          <span>Gestión Integral</span>
        </div>

      </div>

      <nav className="menu">

        <NavLink
          to="/dashboard"
          className="item"
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/inventario"
          className="item"
        >
          📦 Inventario
        </NavLink>

        <NavLink
          to="/usuarios"
          className="item"
        >
          👥 Usuarios
        </NavLink>

        <NavLink
          to="/equipos"
          className="item"
        >
          ⚙️ Equipos
        </NavLink>

        <NavLink
          to="/mantenciones"
          className="item"
        >
          🔧 Mantenciones
        </NavLink>

      </nav>

      <div
        className="perfil"
      >

        <div className="avatar">
          {iniciales}
        </div>

        <div>

          <p>{nombre}</p>

          <span>
            {rol}
          </span>

        </div>

      </div>

    </div>
  );
}

export default Sidebar;