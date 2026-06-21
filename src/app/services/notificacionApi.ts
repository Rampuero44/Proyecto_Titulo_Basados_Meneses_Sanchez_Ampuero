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

export interface NotificacionResponse {
  enviadosWhatsapp: number;
  enviadosEmail: number;
}

export async function enviarResumenEvento(payload: ResumenEventoPayload): Promise<NotificacionResponse> {
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

export async function descargarResumenPdf(payload: ResumenEventoPayload) {
  const response = await apiFetch(`${API_BASE_URL}/notificaciones/resumen/pdf`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("No se pudo generar el PDF");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `resumen-${payload.nombreEvento.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}