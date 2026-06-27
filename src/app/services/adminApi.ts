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

export type UsuariosPorRol = {
  rol: string;
  cantidad: number;
};

export type RegistrosPorMes = {
  mes: string;
  cantidad: number;
};

export type AdminMetricas = {
  totalUsuarios: number;
  usuariosActivos: number;
  usuariosInactivos: number;
  eventosPorEstado: EventosPorEstado[];
  productosMasSeleccionados: ProductoMasSeleccionado[];
  usuariosPorRol: UsuariosPorRol[];
  registrosPorMes: RegistrosPorMes[];
};

export type MaestroPendiente = {
  idMaestro: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  descripcion: string;
  experienciaAnos: number;
  valorServicio: number | null;
  disponibilidad: boolean;
  puntuacion: number | null;
  estadoSolicitud: "PENDIENTE" | "APROBADO" | "RECHAZADO";
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
  const response = await apiFetch(`${API_URL}/maestros-pendientes`);
  if (!response.ok) throw new Error("Error obteniendo maestros pendientes");
  return response.json();
}

export async function obtenerMaestrosAprobados(): Promise<MaestroPendiente[]> {
  const response = await apiFetch(`${API_URL}/maestros-aprobados`);
  if (!response.ok) throw new Error("Error obteniendo maestros aprobados");
  return response.json();
}

export async function obtenerMaestrosRechazados(): Promise<MaestroPendiente[]> {
  const response = await apiFetch(`${API_URL}/maestros-rechazados`);
  if (!response.ok) throw new Error("Error obteniendo maestros rechazados");
  return response.json();
}

export async function aprobarMaestro(id: number): Promise<void> {
  const response = await apiFetch(`${API_URL}/maestros-pendientes/${id}/aprobar`, { method: "PUT" });
  if (!response.ok) throw new Error("Error aprobando maestro");
}

export async function rechazarMaestro(id: number): Promise<void> {
  const response = await apiFetch(`${API_URL}/maestros-pendientes/${id}/rechazar`, { method: "PUT" });
  if (!response.ok) throw new Error("Error rechazando maestro");
}

export async function revocarMaestro(id: number): Promise<void> {
  const response = await apiFetch(`${API_URL}/maestros-aprobados/${id}/revocar`, { method: "PUT" });
  if (!response.ok) throw new Error("Error revocando maestro");
}