const API = "http://localhost:8080/api";

const getHeaders = () => {

  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const obtenerEquipos = async () => {

  const response = await fetch(`${API}/equipos`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error("Error obteniendo equipos");
  }

  return await response.json();
};

export const obtenerEquipoPorId = async (id) => {

  const response = await fetch(`${API}/equipos/${id}`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error("Error obteniendo equipo");
  }

  return await response.json();
};

export const crearEquipo = async (equipo) => {

  const response = await fetch(`${API}/equipos`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(equipo)
  });

  if (!response.ok) {
    throw new Error("Error creando equipo");
  }

  return await response.json();
};

export const actualizarEquipo = async (id, equipo) => {

  const response = await fetch(`${API}/equipos/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(equipo)
  });

  if (!response.ok) {
    throw new Error("Error actualizando equipo");
  }

  return await response.json();
};

export const eliminarEquipo = async (id) => {

  const response = await fetch(`${API}/equipos/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error("Error eliminando equipo");
  }

  return true;
};

export const obtenerMantenciones = async () => {

  const response = await fetch(`${API}/mantenciones`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error("Error obteniendo mantenciones");
  }

  return await response.json();
};

export const crearMantencion = async (mantencion) => {

  const response = await fetch(`${API}/mantenciones`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(mantencion)
  });

  if (!response.ok) {
    throw new Error("Error creando mantención");
  }

  return await response.json();
};

export const obtenerAlertas = async () => {

  const response = await fetch(`${API}/alertas`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error("Error obteniendo alertas");
  }

  return await response.json();
};

export const obtenerUsuarios = async () => {

  const response = await fetch(`${API}/usuarios`, {
    headers: getHeaders()
  });

  if (!response.ok) {

    const errorText = await response.text();

    throw new Error(
      errorText || "Error obteniendo usuarios"
    );
  }

  return await response.json();
};

export const crearUsuario = async (usuario) => {

  const response = await fetch(`${API}/usuarios`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(usuario)
  });

  if (!response.ok) {

    const errorText = await response.text();

    throw new Error(
      errorText || "Error creando usuario"
    );
  }

  return await response.json();
};

export const eliminarUsuario = async (id) => {

  const response = await fetch(`${API}/usuarios/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });

  if (!response.ok) {

    const errorText = await response.text();

    throw new Error(
      errorText || "Error eliminando usuario"
    );
  }

  return true;
};