import "../styles/alertas.css";
import { useState } from "react"

function Reportes() {
  const [filtro, setFiltro] = useState("todos");

  const equipos = [

  { nombre: "Compresor", estado: "vencido", fecha: "2026-03-10" },
  { nombre: "Motor", estado: "vencido", fecha: "2026-03-01" },
  { nombre: "Generador", estado: "vencido", fecha: "2026-02-15" },
  { nombre: "Bomba presión", estado: "vencido", fecha: "2026-01-20" },
  { nombre: "Turbina", estado: "vencido", fecha: "2026-02-01" },

  
  { nombre: "Bomba agua", estado: "proximo", fecha: "2026-04-20" },
  { nombre: "Ventilador industrial", estado: "proximo", fecha: "2026-04-25" },
  { nombre: "Sistema HVAC", estado: "proximo", fecha: "2026-04-28" },
  { nombre: "Caldera", estado: "proximo", fecha: "2026-04-30" },


  { nombre: "Panel solar", estado: "al_dia", fecha: "2026-05-20" },
  { nombre: "UPS", estado: "al_dia", fecha: "2026-06-10" },
  { nombre: "Servidor", estado: "al_dia", fecha: "2026-06-15" },
  { nombre: "Transformador", estado: "al_dia", fecha: "2026-07-01" },
  { nombre: "Iluminación planta", estado: "al_dia", fecha: "2026-07-10" },
];

  const total = equipos.length;
  const vencidos = equipos.filter(e => e.estado === "vencido").length;
  const proximos = equipos.filter(e => e.estado === "proximo").length;
  const alDia = equipos.filter(e => e.estado === "al_dia").length;


  const equiposFiltrados =
    filtro === "todos"
      ? equipos
      : equipos.filter(e => e.estado === filtro);

  return (
    <div className="reportes-container">

      <h1>Reportes</h1>

      
      <div className="reportes-cards">
      <div className="card verde" onClick={() => setFiltro("al_dia")}>
        <span>Al día</span>
        <h2>{alDia}</h2>
      </div>

      <div className="card amarillo" onClick={() => setFiltro("proximo")}>
        <span>Próximos</span>
        <h2>{proximos}</h2>
      </div>

      <div className="card rojo" onClick={() => setFiltro("vencido")}>
        <span>Vencidos</span>
        <h2>{vencidos}</h2>
      </div>

      <div className="card" onClick={() => setFiltro("todos")}>
        <span>Total equipos</span>
        <h2>{total}</h2>
      </div>
    </div>

  
      <div className="filtros">
        <input type="date" />
        <input type="date" />
        <button>Filtrar</button>
      </div>

    
      <table className="tabla">
        <thead>
          <tr>
            <th>Equipo</th>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Próxima</th>
          </tr>
        </thead>
        <tbody>
          {equiposFiltrados.map((equipo, index) => (
            <tr key={index}>
              <td>{equipo.nombre}</td>
              <td>{equipo.fecha}</td>
              <td>Preventiva</td>
              <td>
                {equipo.estado === "vencido" && "🔴 Vencido"}
                {equipo.estado === "proximo" && "🟡 Próximo"}
                {equipo.estado === "al_dia" && "🟢 Al día"}
              </td>
              <td>-</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default Reportes;
