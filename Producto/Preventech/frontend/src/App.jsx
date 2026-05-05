import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Equipos from "./pages/Equipos";
import Mantenciones from "./pages/Mantenciones";
import Reportes from "./pages/Reportes";
import Usuarios from "./pages/Usuarios";
import Inventario from "./pages/Inventario";
import Layout from "./components/Layout";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/mantenciones" element={<Mantenciones />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/reportes" element={<Reportes />} />


        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
