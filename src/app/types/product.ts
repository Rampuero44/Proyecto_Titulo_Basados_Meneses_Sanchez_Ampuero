export type ProductCategory =
  | "proteina"
  | "bebestible"
  | "insumo"
  | "ensalada";

export interface ProductWithPrice {
  id: number;
  nombre: string;
  categoria: string;
  comercio: string;
  marca: string;
  calorias: number;
  precioReferencia: number;
  alcoholico: boolean;
}

export interface CartItem {
  product: ProductWithPrice;
  quantity: number;
}