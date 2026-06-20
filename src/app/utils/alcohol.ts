import { Producto } from "../types/product";

export const esProductoAlcoholico = (producto: Producto): boolean =>
  producto.alcoholico === true;

export const tieneProductosAlcoholicos = (
  seleccionados: { product: Producto }[]
): boolean => seleccionados.some((s) => esProductoAlcoholico(s.product));