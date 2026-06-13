import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Equipos from "./pages/Equipos";
import Mantenciones from "./pages/Mantenciones";
import Usuarios from "./pages/Usuarios";
import Inventario from "./pages/Inventario";
import AlertasPage from "./pages/AlertasPage";
import Layout from "./components/Layout";
import RutaProtegida from "./components/RutaProtegida";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route element={<RutaProtegida />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/equipos" element={<Equipos />} />
            <Route path="/mantenciones" element={<Mantenciones />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/alertas" element={<AlertasPage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;