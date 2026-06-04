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
  const [error, setError] = useState("");

  const ingresar = async () => {

    if (!email.toLowerCase().endsWith("@gmail.com")) {

      setError(
        "Solo se permiten correos @gmail.com"
      );

      setTimeout(() => {
        setError("");
      }, 3000);

      return;
    }

    try {

      const response = await fetch(
        "http://localhost:8080/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Correo o contraseña incorrectos"
        );
      }

      const data = await response.json();

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "rol",
        data.rol
      );

      localStorage.setItem(
        "nombre",
        data.nombre
      );

      localStorage.setItem(
        "email",
        data.email
      );

      navigate("/dashboard");

    } catch (error) {

      setError(error.message);

      setTimeout(() => {
        setError("");
      }, 3000);
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

      {error && (

        <div className="alerta-error">
          ❌ {error}
        </div>

      )}

      <div className="login-card">

        <h1 className="login-title">
          PrevenTech
        </h1>

        <p className="login-subtitle">
          Iniciar Sesión
        </p>

        <Input
          tipo="text"
          placeholder="Correo"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <Input
          tipo="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
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