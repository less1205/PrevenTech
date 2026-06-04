import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/usuarios.css";

import {
  obtenerUsuarios as obtenerUsuariosApi,
  crearUsuario as crearUsuarioApi,
  eliminarUsuario as eliminarUsuarioApi
} from "../services/api";

function Usuarios() {

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("TECNICO");

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [textoConfirmacion, setTextoConfirmacion] = useState("");

  const [mostrarError, setMostrarError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const rolUsuario = localStorage.getItem("rol");

  useEffect(() => {

    if (!rolUsuario?.includes("ADMINISTRADOR")) {
      setLoading(false);
      return;
    }

    obtenerUsuarios();

  }, []);

  const mostrarAlertaError = (mensaje) => {

    setMensajeError(
      mensaje || "Ha ocurrido un error"
    );

    setMostrarError(true);

    setTimeout(() => {
      setMostrarError(false);
    }, 4000);
  };

  const obtenerUsuarios = async () => {

    try {

      const data = await obtenerUsuariosApi();

      setUsuarios(data);

    } catch (error) {

      console.error(
        "Error cargando usuarios:",
        error
      );

      mostrarAlertaError(
        error?.message
      );

    } finally {

      setLoading(false);
    }
  };

  const crearUsuario = async () => {

    if (!nombre.trim()) {

      mostrarAlertaError(
        "Debe ingresar un nombre"
      );

      return;
    }

    if (!email.trim()) {

      mostrarAlertaError(
        "Debe ingresar un correo electrónico"
      );

      return;
    }

    if (!email.toLowerCase().endsWith("@gmail.com")) {

      mostrarAlertaError(
        "El correo debe ser una dirección @gmail.com"
      );

      return;
    }

    if (!password.trim()) {

      mostrarAlertaError(
        "Debe ingresar una contraseña"
      );

      return;
    }

    if (password.length < 8) {

      mostrarAlertaError(
        "La contraseña debe tener al menos 8 caracteres"
      );

      return;
    }

    if (!/[A-Z]/.test(password)) {

      mostrarAlertaError(
        "La contraseña debe contener al menos una letra mayúscula"
      );

      return;
    }

    if (!/[a-z]/.test(password)) {

      mostrarAlertaError(
        "La contraseña debe contener al menos una letra minúscula"
      );

      return;
    }

    if (!/[0-9]/.test(password)) {

      mostrarAlertaError(
        "La contraseña debe contener al menos un número"
      );

      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {

      mostrarAlertaError(
        "La contraseña debe contener al menos un carácter especial"
      );

      return;
    }

    try {

      await crearUsuarioApi({
        nombre,
        email,
        password,
        rol
      });

      setNombre("");
      setEmail("");
      setPassword("");
      setRol("TECNICO");

      await obtenerUsuarios();

    } catch (error) {

      const mensaje =
        error?.message ||
        "Error al crear usuario";

      if (
        mensaje.toLowerCase().includes("gmail")
      ) {

        mostrarAlertaError(
          "El correo debe ser una dirección @gmail.com"
        );

      } else if (
        mensaje.toLowerCase().includes("password") ||
        mensaje.toLowerCase().includes("contraseña")
      ) {

        mostrarAlertaError(
          "La contraseña no cumple los requisitos de seguridad"
        );

      } else {

        mostrarAlertaError(mensaje);
      }
    }
  };

  const eliminarUsuario = async () => {

    if (textoConfirmacion.trim() !== "ELIMINAR") {

      mostrarAlertaError(
        "Debe escribir ELIMINAR para continuar"
      );

      return;
    }

    try {

      await eliminarUsuarioApi(
        usuarioAEliminar.id
      );

      await obtenerUsuarios();

      setMostrarModalEliminar(false);
      setUsuarioAEliminar(null);
      setTextoConfirmacion("");

    } catch (error) {

      mostrarAlertaError(
        error?.message
      );
    }
  };

  if (!rolUsuario?.includes("ADMINISTRADOR")) {
    return <h2>Acceso denegado</h2>;
  }

  if (loading) {
    return <h2>Cargando usuarios...</h2>;
  }

  return (

    <motion.div
      className="usuarios-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22 }}
    >

      {mostrarError && (
        <div className="alerta-error">
          {mensajeError}
        </div>
      )}

      <div className="usuarios-header">

        <div>

          <h1>
            Gestión de Usuarios
          </h1>

          <p>
            Administra usuarios y roles
          </p>

        </div>

                <button
          className="btn-agregar"
          onClick={crearUsuario}
        >
          + Agregar Usuario
        </button>

      </div>

      <div className="form-usuario">

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <select
          value={rol}
          onChange={(e) =>
            setRol(e.target.value)
          }
        >

          <option value="TECNICO">
            TECNICO
          </option>

          <option value="SUPERVISOR">
            SUPERVISOR
          </option>

          <option value="ADMINISTRADOR">
            ADMINISTRADOR
          </option>

        </select>

      </div>

      <div className="tabla-container">

        <table>

          <thead>

            <tr>
              <th>USUARIO</th>
              <th>EMAIL</th>
              <th>ROL</th>
              <th>ACCIONES</th>
            </tr>

          </thead>

          <tbody>

            {usuarios.length === 0 ? (

              <tr>
                <td colSpan="4">
                  No hay usuarios
                </td>
              </tr>

            ) : (

              usuarios.map((u) => (

                <tr key={u.id}>

                  <td>

                    <div className="usuario-info">

                      <div className="avatar">

                        {(u.nombre || "")
                          .split(" ")
                          .map(n => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}

                      </div>

                      <div>
                        <p>{u.nombre}</p>
                      </div>

                    </div>

                  </td>

                  <td>{u.email}</td>

                  <td>

                    <span
                      className={`badge ${(u.rol || "").toLowerCase()}`}
                    >
                      {u.rol}
                    </span>

                  </td>

                  <td>

                    <button
                      className="btn-eliminar"
                      onClick={() => {
                        setUsuarioAEliminar(u);
                        setTextoConfirmacion("");
                        setMostrarModalEliminar(true);
                      }}
                    >
                      Eliminar
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {mostrarModalEliminar && (

        <div className="modal-overlay">

          <div className="modal-eliminar">

            <h2>
              Eliminar Usuario
            </h2>

            <p>
              Está a punto de eliminar el siguiente usuario:
            </p>

            <strong>
              {usuarioAEliminar?.nombre}
            </strong>

            <p className="texto-warning">
              Esta acción es permanente y no se puede deshacer.
            </p>

            <p>
              Para continuar escriba:
              <strong> ELIMINAR </strong>
            </p>

            <input
              type="text"
              placeholder="Escriba ELIMINAR"
              value={textoConfirmacion}
              onChange={(e) =>
                setTextoConfirmacion(e.target.value)
              }
            />

            <div className="modal-botones">

              <button
                className="btn-cancelar"
                onClick={() => {
                  setMostrarModalEliminar(false);
                  setUsuarioAEliminar(null);
                  setTextoConfirmacion("");
                }}
              >
                Cancelar
              </button>

              <button
                className="btn-confirmar-eliminar"
                onClick={eliminarUsuario}
              >
                Eliminar Usuario
              </button>

            </div>

          </div>

        </div>

      )}

    </motion.div>
  );
}

export default Usuarios;