import { apiFetch } from "../utils/apiClient";

const API_URL = `${import.meta.env.VITE_API_URL}/api/admin`;
const MAESTROS_URL = `${import.meta.env.VITE_API_URL}/api/admin/maestros-pendientes`;

export type EventosPorEstado = {
  estado: string;
  cantidad: number;
};

export type ProductoMasSeleccionado = {
  nombre: string;
  vecesSeleccionado: number;
};

export type AdminMetricas = {
  totalUsuarios: number;
  eventosPorEstado: EventosPorEstado[];
  productosMasSeleccionados: ProductoMasSeleccionado[];
};

export type MaestroPendiente = {
  idMaestro: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  descripcion: string;
  experienciaAnos: number;
  valorServicio: number;
  disponibilidad: boolean;
  puntuacion: number;
};

export async function obtenerMetricasAdmin(): Promise<AdminMetricas> {
  const response = await apiFetch(`${API_URL}/metricas`);
  if (!response.ok) {
    if (response.status === 403) throw new Error("No tienes permisos de administrador");
    throw new Error("Error obteniendo métricas");
  }
  return response.json();
}

export async function obtenerMaestrosPendientes(): Promise<MaestroPendiente[]> {
  const response = await apiFetch(MAESTROS_URL);
  if (!response.ok) throw new Error("Error obteniendo maestros pendientes");
  return response.json();
}

export async function aprobarMaestro(id: number): Promise<void> {
  const response = await apiFetch(`${MAESTROS_URL}/${id}/aprobar`, { method: "PUT" });
  if (!response.ok) throw new Error("Error aprobando maestro");
}

export async function rechazarMaestro(id: number): Promise<void> {
  const response = await apiFetch(`${MAESTROS_URL}/${id}/rechazar`, { method: "DELETE" });
  if (!response.ok) throw new Error("Error rechazando maestro");
}