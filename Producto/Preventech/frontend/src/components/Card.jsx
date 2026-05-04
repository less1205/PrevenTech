import "../styles/card.css";

function Card({ titulo, numero, color, icono, badge }) {
  return (
    <div className={`card card-${color}`}>
      <div className="card-top">
        <div className="icon-placeholder">{icono}</div> 
        <span className="badge">{badge}</span>
      </div>
      <div className="card-bottom">
        <p className="numero">{numero}</p>
        <h3 className="titulo">{titulo}</h3>
      </div>
    </div>
  );
}

export default Card;
