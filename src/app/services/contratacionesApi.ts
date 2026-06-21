import { apiFetch } from "../utils/apiClient";

const API_URL = `${import.meta.env.VITE_API_URL}/api/contrataciones`;

export interface ContratacionResponse {
  idContratacion: number;
  nombreMaestro: string;
  valorAcordado: number;
  estado: string;
  fechaContratacion: string;
}

export async function crearContratacion(data: { idMaestro: number; valorAcordado: number }): Promise<ContratacionResponse> {
  const response = await apiFetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al registrar la contratación");
  return response.json();
}