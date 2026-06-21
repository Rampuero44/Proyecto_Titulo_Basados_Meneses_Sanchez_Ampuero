import { apiFetch } from "../utils/apiClient";

const API_URL = `${import.meta.env.VITE_API_URL}/api/admin`;

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

export async function obtenerMetricasAdmin(): Promise<AdminMetricas> {
  const response = await apiFetch(`${API_URL}/metricas`);
  if (!response.ok) {
    if (response.status === 403) throw new Error("No tienes permisos de administrador");
    throw new Error("Error obteniendo métricas");
  }
  return response.json();
}