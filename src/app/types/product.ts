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
  unidadFormato?: string;
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
  idHistorial?: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  precioUnitarioTexto?: string;
  subtotal: number;
  comercio?: string;
  encontrado: boolean;
}

export interface Cotizacion {
  comercio: string;
  total: number;
  productosEncontrados?: number;
  productosFaltantes?: number;
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