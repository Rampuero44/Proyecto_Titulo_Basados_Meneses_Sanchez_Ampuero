// Tipos de datos basados en el diagrama de clases

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: 'usuario' | 'admin';
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
  monto?: number;
  montoManual?: boolean;
  sinAlcohol?: boolean;
  esOrganizador?: boolean;
}

export interface Precio {
  id: number;
  valor: number;
  fecha: string;
  comercioId: number;
}

export interface Proteina {
  id: number;
  eventoId: number;
  tipo: string;
  cantidad: number;
  nombre: string;
  porPrecio: number;
  calorias?: number;
}

export interface Bebestibles {
  id: number;
  eventoId: number;
  tipo: string;
  cantidad: number;
  nombre: string;
  porPrecio: number;
  calorias?: number;
}

export interface Insumos {
  id: number;
  eventoId: number;
  tipo: string;
  cantidad: number;
  nombre: string;
  porPrecio: number;
  calorias?: number;
}

export interface Ensalada {
  id: number;
  eventoId: number;
  tipo: string;
  cantidad: number;
  nombre: string;
  porPrecio: number;
  calorias?: number;
}

export interface CotizacionDetalle {
  nombre: string;
  categoria: 'proteina' | 'bebestible' | 'ensalada' | 'insumo';
  cantidad: number;
  subtotal: number;
}

export interface CotizacionSupermercado {
  supermercado: string;
  total: number;
  totalAlcohol: number;
  detalles: CotizacionDetalle[];
}

export interface Asador {
  id: number;
  nombre: string;
  calificacion: number;
}

export interface ServicioAsado {
  id: number;
  descripcion: string;
  asadorId: number;
  asador?: Asador;
}

export interface Comercio {
  id: number;
  nombre: string;
  ubicacion: string;
}

export interface Evento {
  id: number;
  nombre: string;
  fecha: string;
  presupuesto: number;
  estado: 'planificado' | 'confirmado' | 'finalizado';
  usuarioId: number;
  participantes: Participante[];
  proteinas: Proteina[];
  bebestibles: Bebestibles[];
  insumos: Insumos[];
  ensaladas: Ensalada[];
  servicioAsado?: ServicioAsado;
  caloriasTotales?: number;
  caloriasPorPersona?: number;
  cotizaciones?: CotizacionSupermercado[];
  cotizacionSeleccionada?: string;
  createdAt: string;
}

// Funciones de almacenamiento
export const storage = {
  // Usuarios
  getUsuarios: (): Usuario[] => {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  },
  
  saveUsuario: (usuario: Usuario): void => {
    const usuarios = storage.getUsuarios();
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  },
  
  getUsuarioByEmail: (email: string): Usuario | undefined => {
    const usuarios = storage.getUsuarios();
    return usuarios.find(u => u.email === email);
  },
  
  // Usuario actual
  getCurrentUsuario: (): Usuario | null => {
    const usuario = localStorage.getItem('currentUsuario');
    return usuario ? JSON.parse(usuario) : null;
  },
  
  setCurrentUsuario: (usuario: Usuario | null): void => {
    if (usuario) {
      localStorage.setItem('currentUsuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('currentUsuario');
    }
  },
  
  // Eventos
  getEventos: (): Evento[] => {
    const eventos = localStorage.getItem('eventos');
    return eventos ? JSON.parse(eventos) : [];
  },
  
  saveEvento: (evento: Evento): void => {
    const eventos = storage.getEventos();
    eventos.push(evento);
    localStorage.setItem('eventos', JSON.stringify(eventos));
  },
  
  updateEvento: (eventoId: number, updatedEvento: Evento): void => {
    const eventos = storage.getEventos();
    const index = eventos.findIndex(e => e.id === eventoId);
    if (index !== -1) {
      eventos[index] = updatedEvento;
      localStorage.setItem('eventos', JSON.stringify(eventos));
    }
  },
  
  getEventoById: (id: number): Evento | undefined => {
    const eventos = storage.getEventos();
    return eventos.find(e => e.id === id);
  },
  
  getUsuarioEventos: (usuarioId: number): Evento[] => {
    const eventos = storage.getEventos();
    return eventos.filter(e => e.usuarioId === usuarioId);
  },
  
  deleteEvento: (eventoId: number): void => {
    const eventos = storage.getEventos();
    const filtered = eventos.filter(e => e.id !== eventoId);
    localStorage.setItem('eventos', JSON.stringify(filtered));
  },

  // Comercios
  getComercios: (): Comercio[] => {
    const comercios = localStorage.getItem('comercios');
    return comercios ? JSON.parse(comercios) : [];
  },

  saveComercio: (comercio: Comercio): void => {
    const comercios = storage.getComercios();
    comercios.push(comercio);
    localStorage.setItem('comercios', JSON.stringify(comercios));
  },

  // Asadores
  getAsadores: (): Asador[] => {
    const asadores = localStorage.getItem('asadores');
    return asadores ? JSON.parse(asadores) : [];
  },

  saveAsador: (asador: Asador): void => {
    const asadores = storage.getAsadores();
    asadores.push(asador);
    localStorage.setItem('asadores', JSON.stringify(asadores));
  },
};

// Generar ID único
export const generateId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};
