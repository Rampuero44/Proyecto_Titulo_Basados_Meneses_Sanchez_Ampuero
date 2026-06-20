import { apiFetch } from "../utils/apiClient";

const API_URL = `${import.meta.env.VITE_API_URL}/api/contrataciones`;

export async function crearContratacion(data: { idMaestro: number; valorAcordado: number }) {
  const response = await apiFetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al registrar la contratación");
  return response.json();
}