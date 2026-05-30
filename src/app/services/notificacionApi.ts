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
  try {
    const response = await fetch(`${API_BASE_URL}/notificaciones/resumen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "No se pudo enviar el resumen");
    }

    return response.json();

  } catch (error) {
    console.error("Error enviando notificación:", error);
    throw error;
  }
}