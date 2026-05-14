import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/usuarios.css";

function Usuarios() {

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("TECNICO");

  const token = localStorage.getItem("token");
  const rolUsuario = localStorage.getItem("rol");

  console.log("ROL:", rolUsuario);

  useEffect(() => {

    if (!rolUsuario?.includes("ADMINISTRADOR")) {
      setLoading(false);
      return;
    }

    obtenerUsuarios();

  }, []);

  const obtenerUsuarios = async () => {

    try {

      const res = await fetch(
        "http://localhost:8080/api/usuarios",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("GET STATUS:", res.status);

      if (!res.ok) {

        const errorText = await res.text();

        console.log("ERROR GET:", errorText);

        throw new Error(
          `HTTP ${res.status} - ${errorText}`
        );
      }

      const data = await res.json();

      setUsuarios(data);

    } catch (error) {

      console.error(
        "Error cargando usuarios:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  const crearUsuario = async () => {

    try {

      const res = await fetch(
        "http://localhost:8080/api/usuarios",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            nombre,
            email,
            password,
            rol
          })
        }
      );

      console.log("POST STATUS:", res.status);

      if (!res.ok) {

        const errorText = await res.text();

        console.log(
          "ERROR BACKEND:",
          errorText
        );

        throw new Error(
          `HTTP ${res.status} - ${errorText}`
        );
      }

      const data = await res.json();

      console.log("USUARIO CREADO:", data);

      setNombre("");
      setEmail("");
      setPassword("");
      setRol("TECNICO");

      await obtenerUsuarios();

      alert("Usuario creado correctamente");

    } catch (error) {

      console.error(
        "Error creando usuario:",
        error
      );

      alert(error.message);
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

      <div className="usuarios-header">

        <div>

          <h1>
            Gestión de Usuarios
          </h1>

          <p>
            Administra usuarios y roles
          </p>

        </div>

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

        <button
          className="btn-agregar"
          onClick={crearUsuario}
        >
          + Agregar Usuario
        </button>

      </div>

      <div className="tabla-container">

        <table>

          <thead>

            <tr>
              <th>USUARIO</th>
              <th>EMAIL</th>
              <th>ROL</th>
            </tr>

          </thead>

          <tbody>

            {usuarios.length === 0 ? (

              <tr>
                <td colSpan="3">
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

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </motion.div>
  );
}

export default Usuarios;