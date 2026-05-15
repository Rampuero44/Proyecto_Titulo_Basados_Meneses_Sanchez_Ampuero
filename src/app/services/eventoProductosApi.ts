const API_URL = "http://localhost:8080/api/evento-productos";

export async function crearEventoProducto(
  eventoProducto: any
) {

  const response = await fetch(API_URL, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(eventoProducto),
  });

  if (!response.ok) {
    throw new Error(
      "Error creando evento producto"
    );
  }

  return response.json();
}