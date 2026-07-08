import { apiFetch } from "../utils/apiClient";
import { EventoResponse, EventoDetalleResponse } from "../types/evento";

const API_URL = `${import.meta.env.VITE_API_URL}/api/eventos`;

export interface EventoCreateRequest {
  nombre?: string;
  descripcion?: string;
  fechaEvento?: string;
  direccion?: string;
  presupuesto?: number;
  cantidadPersonas?: number;
  estado?: string;
  idOrganizador?: string;
}

export interface EventoCompletoRequest extends EventoCreateRequest {
  productos?: {
    idProducto: number;
    cantidad: number;
    idHistorial?: number | null;
    seleccionado?: boolean;
  }[];
}

export async function obtenerEventosPorUsuario(idUsuario: string): Promise<EventoResponse[]> {
  const response = await apiFetch(`${API_URL}/usuario/${idUsuario}`);
  if (!response.ok) throw new Error("Error obteniendo eventos");
  return response.json();
}

export async function obtenerBorrador(idUsuario: string): Promise<EventoResponse | null> {
  const response = await apiFetch(`${API_URL}/borrador/${idUsuario}`);
  if (!response.ok) return null;
  return response.json();
}

export async function obtenerDetalleEvento(id: string): Promise<EventoDetalleResponse> {
  const response = await apiFetch(`${API_URL}/${id}/detalle`);
  if (!response.ok) throw new Error("Error obteniendo el detalle del evento");
  return response.json();
}

export async function crearEvento(evento: EventoCreateRequest) {
  const response = await apiFetch(API_URL, {
    method: "POST",
    body: JSON.stringify(evento),
  });
  if (!response.ok) throw new Error("Error creando evento");
  return response.json();
}

export async function crearEventoCompleto(eventoCompleto: EventoCompletoRequest): Promise<EventoResponse> {
  const response = await apiFetch(`${API_URL}/completo`, {
    method: "POST",
    body: JSON.stringify(eventoCompleto),
  });
  if (!response.ok) throw new Error("Error creando evento");
  return response.json();
}

export async function actualizarEvento(id: string, evento: Partial<EventoCreateRequest>) {
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