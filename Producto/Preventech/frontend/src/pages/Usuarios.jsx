import { useEffect, useState } from "react";
import "../styles/usuarios.css";
import { motion } from "framer-motion";

function Usuarios() {

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/usuarios");

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();
      setUsuarios(data);

    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

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
          <h1>Gestión de Usuarios</h1>
          <p>Administra los usuarios y roles del sistema</p>
        </div>

        <button className="btn-agregar">
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
              <th>ESTADO</th>
              <th>TAREAS ASIGNADAS</th>
              <th>ACCIONES</th>
            </tr>
          </thead>

          <tbody>

            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="6">No hay usuarios</td>
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
                        <span>{u.rolDesc}</span>
                      </div>

                    </div>
                  </td>

                  <td>{u.email}</td>

                  <td>
                    <span className={`badge ${(u.rol || "").toLowerCase()}`}>
                      {u.rol}
                    </span>
                  </td>

                  <td>
                    <span className="estado-activo">
                      ● {u.estado}
                    </span>
                  </td>

                  <td>{u.tareas}</td>

                  <td>⋮</td>

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