import { useEffect, useState } from "react";
import "../styles/inventario.css";

function Inventario() {

  const [equipos, setEquipos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [categoria, setCategoria] = useState("");
  const [estado, setEstado] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);

  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: "",
    tipo: "",
    ubicacion: "",
    estado: "AL_DIA"
  });

  /* =========================
     CARGAR EQUIPOS
  ========================= */

  useEffect(() => {
    obtenerEquipos();
  }, []);

  const obtenerEquipos = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/api/equipos"
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      setEquipos(data);

    } catch (error) {

      console.error(
        "Error cargando equipos:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  /* =========================
     GUARDAR EQUIPO
  ========================= */

  const guardarEquipo = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/api/equipos",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(nuevoEquipo)
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      setMostrarModal(false);

      setNuevoEquipo({
        nombre: "",
        tipo: "",
        ubicacion: "",
        estado: "AL_DIA"
      });

      obtenerEquipos();

    } catch (error) {

      console.error(
        "Error guardando equipo:",
        error
      );

    }
  };

  /* =========================
     FILTROS
  ========================= */

  const equiposFiltrados = equipos.filter((equipo) => {

    const coincideCategoria =
      categoria === "" ||
      equipo.tipo === categoria;

    const coincideEstado =
      estado === "" ||
      equipo.estado === estado;

    const coincideUbicacion =
      ubicacion === "" ||
      equipo.ubicacion === ubicacion;

    return (
      coincideCategoria &&
      coincideEstado &&
      coincideUbicacion
    );

  });

  /* =========================
     VALORES ÚNICOS
  ========================= */

  const categorias = [
    ...new Set(equipos.map((e) => e.tipo))
  ];

  const ubicaciones = [
    ...new Set(equipos.map((e) => e.ubicacion))
  ];

  if (loading) {
    return <h2>Cargando inventario...</h2>;
  }

  return (

    <div className="inventario-container container-fluid p-4">

      {/* =========================
          HEADER
      ========================= */}

      <div className="inventario-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

        <div>

          <h1 className="fw-bold">
            Gestión de Inventario
          </h1>

          <p className="text-muted mb-0">
            Administra todos los equipos
          </p>

        </div>

        <button
          className="btn btn-primary btn-agregar"
          onClick={() => setMostrarModal(true)}
        >

          + Añadir Nuevo Equipo

        </button>

      </div>

      {/* =========================
          FILTROS
      ========================= */}

      <div className="filtros d-flex gap-3 mb-4 flex-wrap">

        {/* CATEGORÍA */}

        <select
          className="form-select"
          value={categoria}
          onChange={(e) =>
            setCategoria(e.target.value)
          }
        >

          <option value="">
            Todas las Categorías
          </option>

          {categorias.map((cat, index) => (

            <option
              key={index}
              value={cat}
            >

              {cat}

            </option>

          ))}

        </select>

        {/* ESTADO */}

        <select
          className="form-select"
          value={estado}
          onChange={(e) =>
            setEstado(e.target.value)
          }
        >

          <option value="">
            Todos los Estados
          </option>

          <option value="AL_DIA">
            Al día
          </option>

          <option value="PROXIMO">
            Próximo
          </option>

          <option value="VENCIDO">
            Vencido
          </option>

        </select>

        {/* UBICACIÓN */}

        <select
          className="form-select"
          value={ubicacion}
          onChange={(e) =>
            setUbicacion(e.target.value)
          }
        >

          <option value="">
            Todas las Ubicaciones
          </option>

          {ubicaciones.map((ubi, index) => (

            <option
              key={index}
              value={ubi}
            >

              {ubi}

            </option>

          ))}

        </select>

      </div>

      {/* =========================
          TABLA
      ========================= */}

      <div className="tabla-container">

        <table className="table table-hover align-middle mb-0">

          <thead>

            <tr>

              <th>ID</th>
              <th>Equipo</th>
              <th>Categoría</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Acciones</th>

            </tr>

          </thead>

          <tbody>

            {equiposFiltrados.length === 0 ? (

              <tr>

                <td colSpan="6">
                  No hay equipos
                </td>

              </tr>

            ) : (

              equiposFiltrados.map((equipo) => (

                <tr key={equipo.id}>

                  <td>

                    #{equipo.id}

                  </td>

                  <td>

                    {equipo.nombre}

                  </td>

                  <td>

                    {equipo.tipo}

                  </td>

                  <td>

                    {equipo.ubicacion}

                  </td>

                  <td>

                    {equipo.estado === "AL_DIA" && (
                      <span className="estado verde">
                        Al día
                      </span>
                    )}

                    {equipo.estado === "PROXIMO" && (
                      <span className="estado amarillo">
                        Próximo
                      </span>
                    )}

                    {equipo.estado === "VENCIDO" && (
                      <span className="estado rojo">
                        Vencido
                      </span>
                    )}

                  </td>

                  <td>

                    ⋯

                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </div>

      {/* =========================
          MODAL
      ========================= */}

      {mostrarModal && (

        <div className="modal fade show d-block">

          <div className="modal-dialog">

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title">
                  Nuevo Equipo
                </h5>

                <button
                  className="btn-close"
                  onClick={() =>
                    setMostrarModal(false)
                  }
                />

              </div>

              <div className="modal-body">

                <input
                  type="text"
                  placeholder="Nombre"
                  className="form-control mb-3"
                  value={nuevoEquipo.nombre}
                  onChange={(e) =>
                    setNuevoEquipo({
                      ...nuevoEquipo,
                      nombre: e.target.value
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="Tipo"
                  className="form-control mb-3"
                  value={nuevoEquipo.tipo}
                  onChange={(e) =>
                    setNuevoEquipo({
                      ...nuevoEquipo,
                      tipo: e.target.value
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="Ubicación"
                  className="form-control mb-3"
                  value={nuevoEquipo.ubicacion}
                  onChange={(e) =>
                    setNuevoEquipo({
                      ...nuevoEquipo,
                      ubicacion: e.target.value
                    })
                  }
                />

                <select
                  className="form-select"
                  value={nuevoEquipo.estado}
                  onChange={(e) =>
                    setNuevoEquipo({
                      ...nuevoEquipo,
                      estado: e.target.value
                    })
                  }
                >

                  <option value="AL_DIA">
                    Al día
                  </option>

                  <option value="PROXIMO">
                    Próximo
                  </option>

                  <option value="VENCIDO">
                    Vencido
                  </option>

                </select>

              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setMostrarModal(false)
                  }
                >

                  Cancelar

                </button>

                <button
                  className="btn btn-primary"
                  onClick={guardarEquipo}
                >

                  Guardar

                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Inventario;