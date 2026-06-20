import { apiFetch } from "../utils/apiClient";

const API_URL = `${import.meta.env.VITE_API_URL}/api/eventos`;

export async function obtenerEventosPorUsuario(idUsuario: string) {
  const response = await apiFetch(`${API_URL}/usuario/${idUsuario}`);
  if (!response.ok) throw new Error("Error obteniendo eventos");
  return response.json();
}

export async function obtenerBorrador(idUsuario: string) {
  const response = await apiFetch(`${API_URL}/borrador/${idUsuario}`);
  if (!response.ok) return null;
  return response.json();
}

export async function crearEvento(evento: any) {
  const response = await apiFetch(API_URL, {
    method: "POST",
    body: JSON.stringify(evento),
  });
  if (!response.ok) throw new Error("Error creando evento");
  return response.json();
}

export async function crearEventoCompleto(eventoCompleto: any) {
  const response = await apiFetch(`${API_URL}/completo`, {
    method: "POST",
    body: JSON.stringify(eventoCompleto),
  });
  if (!response.ok) throw new Error("Error creando evento");
  return response.json();
}

export async function actualizarEvento(id: string, evento: any) {
  const response = await apiFetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(evento),
  });
  if (!response.ok) throw new Error("Error actualizando evento");
  return response.json();
}

export async function eliminarEvento(id: string) {
  const response = await apiFetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error eliminando evento");
}