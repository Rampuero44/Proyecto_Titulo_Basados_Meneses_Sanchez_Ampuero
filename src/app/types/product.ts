export type ProductCategory =
  | "proteina"
  | "bebestible"
  | "insumo"
  | "ensalada";

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  slugCategoria?: string;
  marca?: string;
  calorias?: number;
  pesoGramos?: number;
  alcoholico?: boolean;
  imagenUrl?: string;
  precioDesde?: number;
  precioUnitario?: string;
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
export interface ContactoParticipante {
  id: number;
  metodo: string;
  valor: string;
}

export interface Participante {
  id: number;
  nombre: string;
  contactos: ContactoParticipante[];
  metodoContacto?: 'sin_notificacion' | 'correo' | 'telefono';
  contacto?: string;
  aceptaNotificaciones?: boolean;
  monto?: number;
  montoManual?: boolean;
  sinAlcohol?: boolean;
  esOrganizador?: boolean;
}