const API_URL =
  "http://localhost:8080/api/cotizaciones";

export interface CotizacionProductoRequest {

  idProducto: number;

  cantidad: number;
}

export interface CotizacionRequest {

  productos: CotizacionProductoRequest[];
}

export async function generarCotizacion(
  request: CotizacionRequest
) {

  const response = await fetch(
    API_URL,
    {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {

    throw new Error(
      "Error generando cotización"
    );
  }

  return response.json();
}