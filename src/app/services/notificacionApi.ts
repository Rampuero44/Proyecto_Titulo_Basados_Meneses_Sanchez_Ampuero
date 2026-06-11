import { apiFetch } from "../utils/apiClient";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export type DestinatarioNotificacion = {
  nombre: string;
  canal: "whatsapp" | "email";
  destino: string;
  monto?: number;
};

export type ResumenEventoPayload = {
  eventoId: string;
  nombreEvento: string;
  fecha: string;
  organizador: string;
  organizadorEmail: string;
  participantes: number;
  costoTotal: number;
  costoPromedio: number;
  caloriasTotales: number;
  caloriasPorPersona: number;
  cotizacionSeleccionada?: string;
  destinatarios: DestinatarioNotificacion[];
  direccion?: string;
};

export async function enviarResumenEvento(payload: ResumenEventoPayload) {
  const response = await apiFetch(`${API_BASE_URL}/notificaciones/resumen`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "No se pudo enviar el resumen");
  }

  return response.json();
}