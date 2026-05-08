import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { motion } from "framer-motion";

import Button from "../components/Button";
import Input from "../components/Input";

function Login() {
  const navigate = useNavigate();

  const ingresar = () => {
    navigate("/dashboard");
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22 }}
    >
      <div className="login-card">

        <h1 className="login-title">PrevenTech</h1>
        <p className="login-subtitle">Iniciar Sesión</p>

        <Input tipo="text" placeholder="Usuario" />
        <Input tipo="password" placeholder="Contraseña" />

        <Button texto="Ingresar" onClick={ingresar} />

      </div>
    </motion.div>
  );
}

export default Login;