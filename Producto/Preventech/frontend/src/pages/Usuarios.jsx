import "../styles/usuarios.css";

function Usuarios() {
  const usuarios = [
    {
      id: 1,
      nombre: "Carlos Mendoza",
      rolDesc: "Técnico experimentado",
      email: "carlos.mendoza@preventech.com",
      rol: "Técnico",
      estado: "Activo",
      tareas: 16
    },
    {
      id: 2,
      nombre: "María González",
      rolDesc: "Coordinadora de mantenimiento",
      email: "maria.gonzalez@preventech.com",
      rol: "Coordinador",
      estado: "Activo",
      tareas: 19
    },
    {
      id: 3,
      nombre: "Juan Díaz",
      rolDesc: "Administrador del sistema",
      email: "juan.diaz@preventech.com",
      rol: "Administrador",
      estado: "Activo",
      tareas: "-"
    }
  ];

  return (
    <div className="usuarios-container">

      
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
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="usuario-info">
                    <div className="avatar">
                      {u.nombre.split(" ").map(n => n[0]).join("").slice(0,2)}
                    </div>

                    <div>
                      <p>{u.nombre}</p>
                      <span>{u.rolDesc}</span>
                    </div>
                  </div>
                </td>

                <td>{u.email}</td>

                <td>
                  <span className={`badge ${u.rol.toLowerCase()}`}>
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
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Usuarios;
