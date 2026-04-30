function Button({ texto, onClick, tipo = "button" }) {
  return (
    <button className="login-button" type={tipo} onClick={onClick}>
      {texto}
    </button>
  );
}

export default Button;
