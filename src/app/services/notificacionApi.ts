const API_BASE_URL = "http://localhost:8080/api";

export type DestinatarioNotificacion = {
  nombre: string;
  canal: "whatsapp" | "email";
  destino: string;
  monto?: number;
};

export type ResumenEventoPayload = {
  eventoId: number;
  nombreEvento: string;
  fecha: string;
  organizador: string;
  participantes: number;
  costoTotal: number;
  costoPromedio: number;
  caloriasTotales: number;
  caloriasPorPersona: number;
  cotizacionSeleccionada?: string;
  destinatarios: DestinatarioNotificacion[];
};

export async function enviarResumenEvento(payload: ResumenEventoPayload) {
  try {
    console.log("📤 Enviando payload al backend:", payload);

    const response = await fetch("http://localhost:8080/api/notificaciones/resumen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("📡 Status response:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error backend:", errorText);
      throw new Error(errorText || "No se pudo enviar el resumen");
    }

    const data = await response.json();
    console.log("✅ Respuesta backend:", data);

    return data;

  } catch (error) {
    console.error("💥 Error en fetch:", error);
    throw error;
  }
}