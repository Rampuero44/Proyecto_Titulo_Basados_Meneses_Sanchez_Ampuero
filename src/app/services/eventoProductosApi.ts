const API_URL = `${import.meta.env.VITE_API_URL}/api/evento-productos`;
 
export async function crearEventoProducto(data: any) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error creando evento-producto");
  return response.json();
}