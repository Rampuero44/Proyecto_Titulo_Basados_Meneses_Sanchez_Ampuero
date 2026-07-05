export interface EventoResponse {
  id: string;
  nombre: string;
  descripcion: string | null;
  fechaEvento: string;
  direccion: string | null;
  presupuesto: number | null;
  cantidadPersonas: number | null;
  estado: string;
  organizador: string | null;
}

export interface EventoDetalleProductoResponse {
  idProducto: number;
  nombre: string;
  slugCategoria: string | null;
  cantidad: number;
  precioUnitario: number | null;
  precioUnitarioTexto: string | null;
  comercio: string | null;
  seleccionado: boolean;
}

export interface EventoDetalleParticipanteResponse {
  nombre: string;
  rol: string;
  aporte: number;
}

export interface EventoDetalleContratacionResponse {
  idContratacion: number;
  nombreMaestro: string;
  valorAcordado: number;
  estado: string;
}

export interface EventoDetalleResponse {
  id: string;
  nombre: string;
  descripcion: string | null;
  fechaEvento: string;
  direccion: string | null;
  presupuesto: number | null;
  cantidadPersonas: number | null;
  estado: string;
  organizador: string | null;
  productos: EventoDetalleProductoResponse[];
  participantes: EventoDetalleParticipanteResponse[];
  contratacion: EventoDetalleContratacionResponse | null;
}
