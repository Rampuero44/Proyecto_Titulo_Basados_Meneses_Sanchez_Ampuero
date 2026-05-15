const API_URL = "http://localhost:8080/api/productos";

export async function obtenerProductos() {

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error obteniendo productos");
  }

  return response.json();
}