import { Producto } from "../types/product";
import type { ProductoSeleccionado } from "../components/ProductCatalogStep";

export const esProductoAlcoholico = (producto: Producto): boolean =>
  producto.alcoholico === true;

export const tieneProductosAlcoholicos = (
  seleccionados: { product: Producto }[]
): boolean => seleccionados.some((s) => esProductoAlcoholico(s.product));

// Misma regla que usaban (triplicada) handleConfirmarEdad, handleAutenticado y
// handleContinuarDesdeCatalogo en CreateEvent.tsx: solo se filtran productos que
// además de estar marcados como alcoholico, pertenecen a una categoría de bebida.
export const filtrarAlcohol = (
  seleccionados: ProductoSeleccionado[]
): ProductoSeleccionado[] =>
  seleccionados.filter(
    (s) => !(s.product.categoria?.toLowerCase().includes("bebida") && s.product.alcoholico === true)
  );