import { useState } from "react";
import { motion } from "framer-motion";
import "../styles/perfil.css";

function Perfil() {

  const nombre =
    localStorage.getItem("nombre");

  const email =
    localStorage.getItem("email");

  const rol =
    localStorage.getItem("rol");

  const [nuevoCorreo, setNuevoCorreo] =
    useState("");

  const [nuevaPassword, setNuevaPassword] =
    useState("");

  const token =
    localStorage.getItem("token");

  const enviarSolicitud = async (tipo) => {

    try {

      const res = await fetch(
        "http://localhost:8080/api/perfil/solicitud",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            tipo,
            nuevoCorreo,
            nuevaPassword
          })
        }
      );

      if (!res.ok) {
        throw new Error("No se pudo enviar");
      }

      alert("Solicitud enviada");

      setNuevoCorreo("");
      setNuevaPassword("");

    } catch (error) {

      console.error(error);

      alert(error.message);
    }
  };

  const iniciales = nombre
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (

    <motion.div
      className="perfil-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >

      <div className="perfil-card">

        <div className="perfil-avatar">
          {iniciales}
        </div>

        <h1>{nombre}</h1>

        <span className="perfil-rol">
          {rol}
        </span>

        <div className="perfil-info">

          <div className="info-item">
            <label>Correo</label>
            <p>{email}</p>
          </div>

        </div>

        <div className="perfil-actions">

          <h3>Solicitar cambio de correo</h3>

          <input
            type="email"
            placeholder="Nuevo correo"
            value={nuevoCorreo}
            onChange={(e) =>
              setNuevoCorreo(e.target.value)
            }
          />

          <button
            onClick={() =>
              enviarSolicitud("CORREO")
            }
          >
            Solicitar Cambio
          </button>

          <h3>
            Solicitar cambio de contraseña
          </h3>

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nuevaPassword}
            onChange={(e) =>
              setNuevaPassword(e.target.value)
            }
          />

          <button
            onClick={() =>
              enviarSolicitud("PASSWORD")
            }
          >
            Solicitar Cambio
          </button>

        </div>

      </div>

    </motion.div>
  );
}

export default Perfil;