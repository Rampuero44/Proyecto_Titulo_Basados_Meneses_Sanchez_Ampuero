import { Cotizacion, Producto } from "../types/product";
import type { ProductoSeleccionado } from "../components/ProductCatalogStep";

/**
 * Calcula el costo de un subconjunto de "seleccionados" que cumple `filtro`.
 *
 * Si hay una cotización activa con items, se usa el subtotal cotizado de cada
 * producto (más preciso, refleja precios reales por comercio). Si no, se cae
 * a una estimación con `precioDesde * cantidad`.
 *
 * Pensada para reutilizarse más adelante con otros filtros de categoría
 * (ej. carnes/proteínas para participantes veganos), no solo alcohol.
 */
export const calcularCostoFiltrado = (
  seleccionados: ProductoSeleccionado[],
  cotizacionActiva: Cotizacion | null,
  filtro: (product: Producto) => boolean
): number => {
  const filtrados = seleccionados.filter((s) => filtro(s.product));

  if (cotizacionActiva?.items) {
    return filtrados.reduce((sum, s) => {
      const item = cotizacionActiva.items.find((i) => i.nombreProducto === s.product.nombre);
      return sum + (item?.subtotal ?? 0);
    }, 0);
  }

  return filtrados.reduce((sum, s) => sum + (s.product.precioDesde ?? 0) * s.cantidad, 0);
};
