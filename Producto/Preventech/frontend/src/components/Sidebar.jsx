import { NavLink, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {

  const navigate = useNavigate();

  return (

    <div className="sidebar d-flex flex-column">

      <div className="logo d-flex align-items-center gap-3">

        <div className="logo-icon">
          ⚙️
        </div>

        <div>

          <h2 className="m-0">
            PrevenTech
          </h2>

          <span>
            Gestión Integral
          </span>

        </div>

      </div>

      <nav className="menu d-flex flex-column mt-4">

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

        <NavLink
          to="/usuarios"
          className="item"
        >
          👥 Usuarios
        </NavLink>

      </nav>

      <div
        className="perfil mt-auto"
        onClick={() => navigate("/perfil")}
      >

        <div className="avatar">
          JD
        </div>

        <div>

          <p className="mb-0">
            Juan Díaz
          </p>

          <span>
            Administrador
          </span>

        </div>

      </div>

    </div>
  );
}

export default Sidebar;