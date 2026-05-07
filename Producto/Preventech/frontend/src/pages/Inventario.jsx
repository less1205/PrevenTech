import "../styles/inventario.css";

function Inventario() {
  return (
    <div className="inventario-container">

      
      <div className="inventario-header">
        <div>
          <h1>Gestión de Inventario</h1>
          <p>Administra todos los equipos del condominio</p>
        </div>

        <button className="btn-agregar">
          + Añadir Nuevo Equipo
        </button>
      </div>

  
      <div className="filtros">
        <select>
          <option>Todas las Categorías</option>
        </select>

        <select>
          <option>Todos los Estados</option>
        </select>

        <select>
          <option>Todas las Ubicaciones</option>
        </select>
      </div>


      <div className="tabla-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Equipo</th>
              <th>Categoría</th>
              <th>Ubicación</th>
              <th>Última Mantención</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>#EQ-001</td>
              <td>Bomba Hidroneumática #1</td>
              <td>Bombas</td>
              <td>Torre A - Sótano 1</td>
              <td>15/01/2025</td>
              <td><span className="estado verde">Al día</span></td>
              <td>⋯</td>
            </tr>

            <tr>
              <td>#EQ-002</td>
              <td>Ascensor Principal</td>
              <td>Ascensores</td>
              <td>Torre B - Hall</td>
              <td>24/12/2024</td>
              <td><span className="estado amarillo">Preventivo</span></td>
              <td>⋯</td>
            </tr>

            <tr>
              <td>#EQ-003</td>
              <td>Bomba Hidroneumática #3</td>
              <td>Bombas</td>
              <td>Torre A - Sótano 2</td>
              <td>10/01/2024</td>
              <td><span className="estado rojo">Crítico</span></td>
              <td>⋯</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Inventario;