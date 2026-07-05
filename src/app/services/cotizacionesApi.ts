import { apiFetch } from "../utils/apiClient";
import { Cotizacion } from "../types/product";

const API_URL = `${import.meta.env.VITE_API_URL}/api/cotizaciones`;

export interface CotizacionProductoRequest {
  idProducto: number;
  cantidad: number;
}

export interface CotizacionRequest {
  productos: CotizacionProductoRequest[];
}

export interface CotizacionResultado {
  cotizaciones: Cotizacion[];
}

export async function generarCotizacion(request: CotizacionRequest): Promise<CotizacionResultado> {
  const response = await apiFetch(API_URL, {
    method: "POST",
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error("Error generando cotización");
  return response.json();
}