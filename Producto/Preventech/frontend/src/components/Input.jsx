function Input({ tipo, placeholder }) {
  return (
    <input
      type={tipo}
      placeholder={placeholder}
      className="login-input"
    />
  );
}

export default Input;
