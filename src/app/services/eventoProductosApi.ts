import { apiFetch } from "../utils/apiClient";

const API_URL = `${import.meta.env.VITE_API_URL}/api/evento-productos`;

export interface EventoProductoRequest {
  idEvento: string;
  idProducto: number;
  idHistorial?: number;
  cantidad: number;
  seleccionado?: boolean;
}

// Nota: esta función no se invoca desde ningún punto del frontend actual
// (la creación de productos de evento ocurre vía crearEventoCompleto en
// eventosApi.ts). Se tipó igual para dejar F-10 completo en este servicio.
export async function crearEventoProducto(data: EventoProductoRequest) {
  const response = await apiFetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error creando evento-producto");
  return response.json();
}