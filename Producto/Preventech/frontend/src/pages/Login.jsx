import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { motion } from "framer-motion";

import Button from "../components/Button";
import Input from "../components/Input";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const ingresar = async () => {

    try {

      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.rol);
      localStorage.setItem("nombre", data.nombre);
      localStorage.setItem("email", data.email);

      navigate("/dashboard");

    } catch (error) {
      alert(error.message);
    }
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

        <p className="login-subtitle">
          Iniciar Sesión
        </p>

        <Input
          tipo="text"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          tipo="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          texto="Ingresar"
          onClick={ingresar}
        />

      </div>

    </motion.div>
  );
}

export default Login;