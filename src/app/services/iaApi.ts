import { apiFetch } from "../utils/apiClient";

const API_URL = `${import.meta.env.VITE_API_URL}/api/ia`;

export interface ProductoIaDTO {
  nombre: string;
  cantidad: number;
  slugCategoria: string;
  precioUnitario?: string;
  pesoGramos?: number;
  unidadFormato?: string;
}

export interface CotizacionComercioDTO {
  comercio: string;
  total: number;
}

export interface SugerenciasRequest {
  asistentes: number;
  tipoAsado: string;
  presupuesto: number;
  productos: ProductoIaDTO[];
}

export interface CotizacionIaRequest {
  asistentes: number;
  tipoAsado: string;
  presupuesto: number;
  productos: ProductoIaDTO[];
  cotizaciones: CotizacionComercioDTO[];
}

export interface IaResponse {
  texto: string;
  ok: boolean;
}

export const LIMITE_IA_ALCANZADO = "LIMITE_IA_ALCANZADO";

export async function obtenerSugerencias(req: SugerenciasRequest): Promise<IaResponse> {
  const response = await apiFetch(`${API_URL}/sugerencias`, {
    method: "POST",
    body: JSON.stringify(req),
  });
  if (response.status === 429) throw new Error(LIMITE_IA_ALCANZADO);
  if (!response.ok) throw new Error("Error obteniendo sugerencias");
  return response.json();
}

export async function analizarCotizacion(req: CotizacionIaRequest): Promise<IaResponse> {
  const response = await apiFetch(`${API_URL}/cotizacion`, {
    method: "POST",
    body: JSON.stringify(req),
  });
  if (response.status === 429) throw new Error(LIMITE_IA_ALCANZADO);
  if (!response.ok) throw new Error("Error analizando cotización");
  return response.json();
}