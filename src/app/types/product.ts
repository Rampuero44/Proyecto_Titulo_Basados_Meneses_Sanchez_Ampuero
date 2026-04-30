// Tipos basados en el diagrama de clases v3

export type ProductCategory = 'proteina' | 'bebestible' | 'insumo' | 'ensalada';

export interface Precio {
  idPrecio: number;
  valor: number;
  fecha: Date;
  idComercio: number;
}

export interface Comercio {
  idComercio: number;
  nombre: string;
  enlace: string;
}

export interface BaseProduct {
  id: number;
  idEvento: number;
  tipo: string;
  nombre: string;
  cantidad: number;
  idPrecio: number;
  calorias: number;
}

export interface Proteina extends BaseProduct {
  idProteina: number;
  category: 'proteina';
}

export interface Bebestible extends BaseProduct {
  idBebestible: number;
  formato: string; // "lata", "botella", "caja"
  category: 'bebestible';
}

export interface Insumo extends BaseProduct {
  idInsumo: number;
  category: 'insumo';
}

export interface Ensalada extends BaseProduct {
  idEnsalada: number;
  category: 'ensalada';
}

export type Product = Proteina | Bebestible | Insumo | Ensalada;

export interface ProductWithPrice extends Product {
  precio: Precio;
  comercio: Comercio;
}

export interface CartItem {
  product: ProductWithPrice;
  quantity: number;
}
