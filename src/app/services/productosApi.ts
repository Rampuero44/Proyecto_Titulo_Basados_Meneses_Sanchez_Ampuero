import { apiFetch } from "../utils/apiClient";

const API_URL = `${import.meta.env.VITE_API_URL}/api/productos`;

export async function obtenerProductos() {
  const response = await apiFetch(API_URL);
  if (!response.ok) throw new Error("Error obteniendo productos");
  return response.json();
}