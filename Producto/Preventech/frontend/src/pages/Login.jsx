import "../styles/login.css";

function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">PrevenTech</h1>
        <p className="login-subtitle">Iniciar Sesión</p>

        <input className="login-input" type="text" placeholder="Usuario" />
        <input className="login-input" type="password" placeholder="Contraseña" />

        <button className="login-button">Ingresar</button>
      </div>
    </div>
  );
}

export default Login;
