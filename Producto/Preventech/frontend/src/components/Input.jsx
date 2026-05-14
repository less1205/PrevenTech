function Input({
  tipo,
  placeholder,
  value,
  onChange
}) {

  return (
    <input
      type={tipo}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="login-input"
    />
  );
}

export default Input;