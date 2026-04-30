function Card({ titulo, numero }) {
  return (
    <div className="card-box">
      <h3>{titulo}</h3>
      <h1>{numero}</h1>
    </div>
  );
}

export default Card;
