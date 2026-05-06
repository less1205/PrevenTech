import { useState } from "react";
import "../styles/equipos.css";

function Equipos() {

  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoIndex, setEditandoIndex] = useState(null);

  const [listaEquipos, setListaEquipos] = useState([
  { nombre: "Bomba agua", tipo: "Hidráulico", ubicacion: "Sala máquinas", fecha: "2026-04-20", estado: "proximo" },
  { nombre: "Compresor", tipo: "Industrial", ubicacion: "Subterráneo", fecha: "2026-03-10", estado: "vencido" },
  { nombre: "Motor eléctrico", tipo: "Eléctrico", ubicacion: "Piso 1", fecha: "2026-03-01", estado: "vencido" },
  { nombre: "Panel solar", tipo: "Energía", ubicacion: "Techo", fecha: "2026-06-10", estado: "al_dia" },
  { nombre: "Caldera", tipo: "Térmico", ubicacion: "Sala técnica", fecha: "2026-04-28", estado: "proximo" },
  { nombre: "Generador diesel", tipo: "Energía", ubicacion: "Exterior", fecha: "2026-02-15", estado: "vencido" },
  { nombre: "Sistema HVAC", tipo: "Climatización", ubicacion: "Piso 3", fecha: "2026-05-15", estado: "al_dia" },
  { nombre: "Ascensor", tipo: "Transporte", ubicacion: "Edificio A", fecha: "2026-04-25", estado: "proximo" },
  { nombre: "Transformador", tipo: "Eléctrico", ubicacion: "Subestación", fecha: "2026-01-20", estado: "vencido" },
  { nombre: "Bomba contra incendio", tipo: "Seguridad", ubicacion: "Subterráneo", fecha: "2026-05-30", estado: "al_dia" },
  { nombre: "Extractor industrial", tipo: "Ventilación", ubicacion: "Planta", fecha: "2026-04-18", estado: "proximo" },
  { nombre: "UPS respaldo", tipo: "Energía", ubicacion: "Sala servidores", fecha: "2026-03-22", estado: "vencido" }
]);


  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: "",
    tipo: "",
    ubicacion: "",
    fecha: ""
  });

  const eliminarEquipo = (index) => {
    const nuevaLista = listaEquipos.filter((_, i) => i !== index);
    setListaEquipos(nuevaLista);
  };

  const guardarEquipo = () => {

    if (!nuevoEquipo.nombre || !nuevoEquipo.tipo) {
      alert("Completa los campos");
      return;
    }

    let nuevaLista = [...listaEquipos];

    if (editandoIndex !== null) {
      nuevaLista[editandoIndex] = { ...nuevoEquipo, estado: "al_dia" };
    } else {
      nuevaLista.push({ ...nuevoEquipo, estado: "al_dia" });
    }

    setListaEquipos(nuevaLista);
    setMostrarModal(false);
    setEditandoIndex(null);

    setNuevoEquipo({
      nombre: "",
      tipo: "",
      ubicacion: "",
      fecha: ""
    });
  };

  const equiposFiltrados = listaEquipos.filter(e => {
    const coincideBusqueda =
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.tipo.toLowerCase().includes(busqueda.toLowerCase());

    const coincideFiltro =
      filtro === "todos" || e.estado === filtro;

    return coincideBusqueda && coincideFiltro;
  });

  return (
    <div className="equipos-container">

      <h1>Equipos</h1>

      <input
        type="text"
        placeholder="Buscar por nombre o tipo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="buscador"
      />

      <div className="filtros">
        <button onClick={() => setFiltro("todos")}>Todos</button>
        <button onClick={() => setFiltro("al_dia")}>🟢 Al día</button>
        <button onClick={() => setFiltro("proximo")}>🟡 Próximos</button>
        <button onClick={() => setFiltro("vencido")}>🔴 Vencidos</button>
      </div>

      <button className="btn-agregar" onClick={() => setMostrarModal(true)}>
        + Nuevo equipo
      </button>

      <table className="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Ubicación</th>
            <th>Instalación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {equiposFiltrados.length === 0 ? (
            <tr>
              <td colSpan="6">No hay equipos</td>
            </tr>
          ) : (
            equiposFiltrados.map((equipo, index) => (
              <tr key={index}>
                <td>{equipo.nombre}</td>
                <td>{equipo.tipo}</td>
                <td>{equipo.ubicacion}</td>
                <td>{equipo.fecha}</td>
                <td>
                  {equipo.estado === "vencido" && "🔴 Vencido"}
                  {equipo.estado === "proximo" && "🟡 Próximo"}
                  {equipo.estado === "al_dia" && "🟢 Al día"}
                </td>
                <td>
                  <button
                    className="editar"
                    onClick={() => {
                      setEditandoIndex(index);
                      setNuevoEquipo(equipo);
                      setMostrarModal(true);
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="eliminar"
                    onClick={() => eliminarEquipo(index)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">

            <h2>{editandoIndex !== null ? "Editar" : "Nuevo"} Equipo</h2>

            <input
              placeholder="Nombre"
              value={nuevoEquipo.nombre}
              onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, nombre: e.target.value })}
            />

            <input
              placeholder="Tipo"
              value={nuevoEquipo.tipo}
              onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, tipo: e.target.value })}
            />

            <input
              placeholder="Ubicación"
              value={nuevoEquipo.ubicacion}
              onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, ubicacion: e.target.value })}
            />

            <input
              type="date"
              value={nuevoEquipo.fecha}
              onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, fecha: e.target.value })}
            />

            <div className="modal-buttons">
              <button onClick={guardarEquipo}>Guardar</button>
              <button onClick={() => setMostrarModal(false)}>Cancelar</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Equipos;
