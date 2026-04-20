export const formatearFecha = (fecha: string): string => {
  if (!fecha) return "";

  const partes = fecha.split("-");
  if (partes.length !== 3) {
    return fecha;
  }

  const [anio, mes, dia] = partes;
  return `${dia}/${mes}/${anio}`;
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
