const API_URL = `${import.meta.env.VITE_API_URL}/api/eventos`;

export async function obtenerEventos() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error obteniendo eventos");
  return response.json();
}

export async function crearEvento(evento: any) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(evento),
  });
  if (!response.ok) throw new Error("Error creando evento");
  return response.json();
}