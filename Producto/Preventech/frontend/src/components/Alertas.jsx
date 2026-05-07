import "../styles/alertas.css";
function Alertas() {
  const alertas = [
    { titulo: "Bomba Hidroneumática #3", tiempo: "Hace 2h", tipo: "critico" },
    { titulo: "Ascensor Principal", tiempo: "Hace 5h", tipo: "preventivo" },
    { titulo: "Sistema CCTV Zona Norte", tiempo: "Hace 1d", tipo: "critico" },
    { titulo: "Generador Eléctrico", tiempo: "Hace 2d", tipo: "preventivo" }
  ];

  return (
    <div className="alertas">
      <h3>Alertas Recientes</h3>

      {alertas.map((a, i) => (
        <div key={i} className={`alerta ${a.tipo}`}>
          <p>{a.titulo}</p>
          <span>{a.tiempo}</span>
        </div>
      ))}
    </div>
  );
}

export default Alertas;