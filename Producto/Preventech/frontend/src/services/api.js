const API = "http://localhost:8080/api";

export const obtenerEquipos = async () => {

  const response = await fetch(`${API}/equipos`);

  if (!response.ok) {
    throw new Error("Error obteniendo equipos");
  }

  return await response.json();
};

export const obtenerEquipoPorId = async (id) => {

  const response = await fetch(`${API}/equipos/${id}`);

  if (!response.ok) {
    throw new Error("Error obteniendo equipo");
  }

  return await response.json();
};

export const crearEquipo = async (equipo) => {

  const response = await fetch(`${API}/equipos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(equipo),
  });

  if (!response.ok) {
    throw new Error("Error creando equipo");
  }

  return await response.json();
};

export const actualizarEquipo = async (id, equipo) => {

  const response = await fetch(`${API}/equipos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(equipo),
  });

  if (!response.ok) {
    throw new Error("Error actualizando equipo");
  }

  return await response.json();
};

export const eliminarEquipo = async (id) => {

  const response = await fetch(`${API}/equipos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error eliminando equipo");
  }

  return true;
};

export const obtenerMantenciones = async () => {

  const response = await fetch(`${API}/mantenciones`);

  if (!response.ok) {
    throw new Error("Error obteniendo mantenciones");
  }

  return await response.json();
};

export const crearMantencion = async (mantencion) => {

  const response = await fetch(`${API}/mantenciones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mantencion),
  });

  if (!response.ok) {
    throw new Error("Error creando mantención");
  }

  return await response.json();
};

export const obtenerAlertas = async () => {

  const response = await fetch(`${API}/alertas`);

  if (!response.ok) {
    throw new Error("Error obteniendo alertas");
  }

  return await response.json();
};

export const obtenerUsuarios = async () => {

  const response = await fetch(`${API}/usuarios`);

  if (!response.ok) {
    throw new Error("Error obteniendo usuarios");
  }

  return await response.json();
};