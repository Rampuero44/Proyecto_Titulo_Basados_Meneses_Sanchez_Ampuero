export interface ZonaOperacion {
  region: string;
  comunas: string[];
}

export interface Asador {
  id: number;
  nombre: string;
  rut: string;
  telefono: string;
  correo: string;
  foto: string;
  redSocial: string;
  calificacion: number;
  descripcion: string;
  formasPago: string[];
  zonas: ZonaOperacion[];
  tarifaBase: number;        // precio base por evento
  tarifaPorPersona: number;  // costo adicional por persona
}

export const mockAsadores: Asador[] = [
  {
    id: 1,
    nombre: "Carlos Muñoz Parrillero",
    rut: "12.345.678-9",
    telefono: "+56 9 8123 4567",
    correo: "carlos.munoz@parrillero.cl",
    foto: "",
    redSocial: "@carlos_parrillero",
    calificacion: 4.8,
    descripcion: "Maestro asador con más de 15 años de experiencia. Especialista en cortes premium de vacuno y cordero magallánico. Incluye todo el equipamiento necesario.",
    formasPago: ["Efectivo", "Transferencia", "Débito"],
    zonas: [
      { region: "Metropolitana", comunas: ["Las Condes", "Providencia", "Ñuñoa", "La Reina", "Vitacura"] }
    ],
    tarifaBase: 80000,
    tarifaPorPersona: 3500,
  },
  {
    id: 2,
    nombre: "Roberto Soto Asados",
    rut: "15.678.901-2",
    telefono: "+56 9 7234 5678",
    correo: "rsoto.asados@gmail.com",
    foto: "",
    redSocial: "@rsoto_asados",
    calificacion: 4.5,
    descripcion: "Parrillero profesional enfocado en eventos familiares. Manejo de todo tipo de carnes, embutidos y mariscos. Puntual y organizado.",
    formasPago: ["Efectivo", "Transferencia"],
    zonas: [
      { region: "Metropolitana", comunas: ["Maipú", "Pudahuel", "Cerrillos", "Estación Central", "Quinta Normal"] }
    ],
    tarifaBase: 65000,
    tarifaPorPersona: 2800,
  },
  {
    id: 3,
    nombre: "Ana Torres Grill & BBQ",
    rut: "17.890.234-5",
    telefono: "+56 9 6345 6789",
    correo: "ana.torres.grill@gmail.com",
    foto: "",
    redSocial: "@ana_grill_bbq",
    calificacion: 4.9,
    descripcion: "Primera maestra asadora certificada de la región. Especialista en técnicas BBQ americano y fusión. Incluye mise en place completo y presentación gourmet.",
    formasPago: ["Efectivo", "Transferencia", "Débito", "Crédito"],
    zonas: [
      { region: "Metropolitana", comunas: ["Santiago Centro", "Recoleta", "Independencia", "Conchalí", "Renca"] }
    ],
    tarifaBase: 95000,
    tarifaPorPersona: 4000,
  },
  {
    id: 4,
    nombre: "Pedro Fuentes Parrillas",
    rut: "10.234.567-8",
    telefono: "+56 9 5456 7890",
    correo: "pfuentes.parrillas@hotmail.com",
    foto: "",
    redSocial: "@pedro_fuentes_parrillas",
    calificacion: 4.3,
    descripcion: "Asador con 10 años en el rubro. Precios accesibles para eventos medianos y grandes. Especialista en longanizas artesanales y chorizos.",
    formasPago: ["Efectivo", "Transferencia"],
    zonas: [
      { region: "Metropolitana", comunas: ["La Florida", "Puente Alto", "San Bernardo", "El Bosque", "La Granja"] }
    ],
    tarifaBase: 55000,
    tarifaPorPersona: 2500,
  },
  {
    id: 5,
    nombre: "Ignacio Valdés Premium BBQ",
    rut: "19.012.345-6",
    telefono: "+56 9 4567 8901",
    correo: "ivaldez.bbq@gmail.com",
    foto: "",
    redSocial: "@nacho_premium_bbq",
    calificacion: 5.0,
    descripcion: "El mejor parrillero de Santiago según ranking 2025. Trabaja exclusivamente con cortes importados y nacionales premium. Incluye sommelier de vinos para maridaje.",
    formasPago: ["Transferencia", "Débito", "Crédito"],
    zonas: [
      { region: "Metropolitana", comunas: ["Las Condes", "Vitacura", "Lo Barnechea", "Providencia", "La Reina"] }
    ],
    tarifaBase: 150000,
    tarifaPorPersona: 6000,
  },
];
