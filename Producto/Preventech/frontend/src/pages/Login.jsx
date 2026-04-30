import { useNavigate } from "react-router-dom";
import "../styles/login.css";

import Button from "../components/Button";
import Input from "../components/Input";

function Login() {
  const navigate = useNavigate();

  const ingresar = () => {
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1 className="login-title">PrevenTech</h1>
        <p className="login-subtitle">Iniciar Sesión</p>

        <Input tipo="text" placeholder="Usuario" />
        <Input tipo="password" placeholder="Contraseña" />

        <Button texto="Ingresar" onClick={ingresar} />

      </div>
    </div>
  );
}

export default Login;
