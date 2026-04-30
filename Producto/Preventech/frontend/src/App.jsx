import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Equipos from "./pages/Equipos";
import Mantenciones from "./pages/Mantenciones";
import Alertas from "./pages/Alertas";
import Usuarios from "./pages/Usuarios";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/mantenciones" element={<Mantenciones />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
