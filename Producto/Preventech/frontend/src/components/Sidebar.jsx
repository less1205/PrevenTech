import { NavLink, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">

      <div className="logo">
        <div className="logo-icon"></div>
        <div>
          <h2>PrevenTech</h2>
          <span>Gestión Integral</span>
        </div>
      </div>

      <nav className="menu">
        <NavLink to="/dashboard" className="item" icono={"📊"}>
          Dashboard
        </NavLink>

        <NavLink to="/inventario" className="item" icono={"📦"}>
          Inventario
        </NavLink>

        <NavLink to="/reportes" className="item" icono={"📈"}>
          Reportes
        </NavLink>

        <NavLink to="/usuarios" className="item" icono={"👥"}>
          Usuarios
        </NavLink>
      </nav>

      <div className="perfil" onClick={() => navigate("/perfil")}>
        <div className="avatar">JD</div>
        <div>
          <p>Juan Díaz</p>
          <span>Administrador</span>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;