export type ProductCategory =
  | "proteina"
  | "bebestible"
  | "insumo"
  | "ensalada";

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  marca?: string;
  calorias?: number;
  alcoholico?: boolean;
}

export interface CartItem {
  product: Producto;
  quantity: number;
}

export interface CotizacionItem {
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  encontrado: boolean;
}

export interface Cotizacion {
  comercio: string;
  total: number;
  items: CotizacionItem[];
}