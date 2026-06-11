import { apiFetch } from "../utils/apiClient";

const API_URL = `${import.meta.env.VITE_API_URL}/api/cotizaciones`;

export interface CotizacionProductoRequest {
  idProducto: number;
  cantidad: number;
}

export interface CotizacionRequest {
  productos: CotizacionProductoRequest[];
}

export async function generarCotizacion(request: CotizacionRequest) {
  const response = await apiFetch(API_URL, {
    method: "POST",
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error("Error generando cotización");
  return response.json();
}