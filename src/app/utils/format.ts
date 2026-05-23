export const formatearFecha = (fecha: string): string => {
  if (!fecha) return "";
  try {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return fecha;
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return fecha;
  }
};

export const obtenerUnidadItem = (nombre: string, tipo: string): string => {
  const texto = `${nombre} ${tipo}`.toLowerCase();

  if (texto.includes("kg")) return "kg";
  if (texto.includes("pack")) return "packs";
  if (texto.includes("2l") || texto.includes("botella") || texto.includes("agua") || texto.includes("gaseosa")) {
    return "botellas";
  }
  if (texto.includes("bolsa")) return "bolsas";
  if (texto.includes("chorizo") || texto.includes("pan")) return "unidades";
  if (texto.includes("ensalada")) return "preparaciones";

  return "unidades";
};

export const formatearCantidad = (cantidad: number, unidad: string): string => {
  const cantidadFormateada = Number.isInteger(cantidad) ? cantidad.toString() : cantidad.toFixed(2);
  return `${cantidadFormateada} ${unidad}`;
};