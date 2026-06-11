import { apiFetch } from "../utils/apiClient";

const API_URL = `${import.meta.env.VITE_API_URL}/api/evento-productos`;

export async function crearEventoProducto(data: any) {
  const response = await apiFetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error creando evento-producto");
  return response.json();
}