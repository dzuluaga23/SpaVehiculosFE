import axios from "axios";

const API_BASE = "https://spavehiculos.runasp.net/api";

export const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("CurrentUser"));
  if (!user?.token) {
    throw new Error("No estás autenticado.");
  }
  return {
    Authorization: `Bearer ${user.token}`, 
    "Content-Type": "application/json",
  };
};

export const obtenerClientes = async () => {
  const response = await axios.get(`${API_BASE}/Clientes/ConsultarTodos`, {
    headers: getAuthHeaders(),
  });
  return response.data.Data;
};

export const obtenerServicios = async () => {
  const response = await axios.get(`${API_BASE}/Servicios/ConsultarTodos`, {
    headers: getAuthHeaders(),
  });
  return response.data.Data;
};

export const obtenerSedes = async () => {
  const response = await axios.get(`${API_BASE}/Sedes/ConsultarTodos`, {
    headers: getAuthHeaders(),
  });
  return response.data.Data;
};

export const crearReserva = async (reserva) => {
  const response = await axios.post(`${API_BASE}/Reservas/CrearReserva`, reserva, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const crearServicio = async (servicio) => {
  const response = await axios.post(`${API_BASE}/Servicios/CrearServicio`, servicio, {
    headers: getAuthHeaders(),
  });
  return response.data.Data;
};