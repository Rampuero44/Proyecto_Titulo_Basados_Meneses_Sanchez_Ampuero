import { apiFetch } from "../utils/apiClient";
import { Producto } from "../types/product";

const API_URL = `${import.meta.env.VITE_API_URL}/api/productos`;

export async function obtenerProductos(): Promise<Producto[]> {
  const response = await apiFetch(API_URL);
  if (!response.ok) throw new Error("Error obteniendo productos");
  return response.json();
}