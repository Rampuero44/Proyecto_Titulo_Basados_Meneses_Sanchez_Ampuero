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

export type AuditoriaProducto = {
  idAuditoria: number;
  nombreProducto: string;
  accion: string;
  fechaCambio: string;
  usuarioResponsable: string;
};

export async function obtenerMetricasAdmin(): Promise<AdminMetricas> {
  const response = await apiFetch(`${API_URL}/metricas`);
  if (!response.ok) {
    if (response.status === 403) throw new Error("No tienes permisos de administrador");
    throw new Error("Error obteniendo métricas");
  }
  return response.json();
}

export async function obtenerFeedAuditoriaProductos(): Promise<AuditoriaProducto[]> {
  const response = await apiFetch(`${API_URL}/auditoria-productos`);
  if (!response.ok) {
    if (response.status === 403) throw new Error("No tienes permisos de administrador");
    throw new Error("Error obteniendo actividad de productos");
  }
  return response.json();
}