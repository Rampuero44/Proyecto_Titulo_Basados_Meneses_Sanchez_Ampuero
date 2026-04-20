import { Proteina, Bebestibles, Insumos, Ensalada, CotizacionSupermercado } from './localStorage';

export interface CalculoInsumos {
  proteinas: Proteina[];
  bebestibles: Bebestibles[];
  insumos: Insumos[];
  ensaladas: Ensalada[];
  costoTotal: number;
  costoPorPersona: number;
  caloriasTotales: number;
  caloriasPorPersona: number;
}

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export const calcularInsumos = (
  eventoId: number,
  cantidadParticipantes: number
): CalculoInsumos => {
  const proteinas: Proteina[] = [
    {
      id: Date.now() + 1,
      eventoId,
      tipo: 'carne',
      cantidad: cantidadParticipantes * 0.5,
      nombre: 'Lomo Vetado (kg)',
      porPrecio: 8000,
      calorias: 2500,
    },
    {
      id: Date.now() + 2,
      eventoId,
      tipo: 'pollo',
      cantidad: cantidadParticipantes * 0.3,
      nombre: 'Pollo (kg)',
      porPrecio: 3500,
      calorias: 1900,
    },
    {
      id: Date.now() + 3,
      eventoId,
      tipo: 'chorizo',
      cantidad: cantidadParticipantes * 2,
      nombre: 'Chorizo',
      porPrecio: 800,
      calorias: 280,
    },
  ];

  const bebestibles: Bebestibles[] = [
    {
      id: Date.now() + 10,
      eventoId,
      tipo: 'cerveza',
      cantidad: Math.ceil((cantidadParticipantes * 3) / 6),
      nombre: 'Cerveza (pack 6)',
      porPrecio: 6000,
      calorias: 900,
    },
    {
      id: Date.now() + 11,
      eventoId,
      tipo: 'gaseosa',
      cantidad: Math.ceil(cantidadParticipantes / 4),
      nombre: 'Gaseosa 2L',
      porPrecio: 2500,
      calorias: 840,
    },
    {
      id: Date.now() + 12,
      eventoId,
      tipo: 'agua',
      cantidad: Math.ceil(cantidadParticipantes / 3),
      nombre: 'Agua mineral 2L',
      porPrecio: 1500,
      calorias: 0,
    },
  ];

  const insumos: Insumos[] = [
    {
      id: Date.now() + 20,
      eventoId,
      tipo: 'carbon',
      cantidad: Math.ceil(cantidadParticipantes / 5),
      nombre: 'Carbón',
      porPrecio: 5000,
      calorias: 0,
    },
    {
      id: Date.now() + 21,
      eventoId,
      tipo: 'pan',
      cantidad: Math.ceil((cantidadParticipantes * 2) / 10),
      nombre: 'Pan (bolsa 10)',
      porPrecio: 2000,
      calorias: 2650,
    },
    {
      id: Date.now() + 22,
      eventoId,
      tipo: 'condimento',
      cantidad: 1,
      nombre: 'Chimichurri',
      porPrecio: 3000,
      calorias: 180,
    },
  ];

  const ensaladas: Ensalada[] = [
    {
      id: Date.now() + 30,
      eventoId,
      tipo: 'mixta',
      cantidad: 1,
      nombre: 'Ensalada mixta',
      porPrecio: 4000,
      calorias: 250,
    },
    {
      id: Date.now() + 31,
      eventoId,
      tipo: 'tomate',
      cantidad: Math.ceil(cantidadParticipantes / 3),
      nombre: 'Tomate (kg)',
      porPrecio: 2000,
      calorias: 180,
    },
  ];

  const costoProteinas = proteinas.reduce((sum, p) => sum + (p.cantidad * p.porPrecio), 0);
  const costoBebestibles = bebestibles.reduce((sum, b) => sum + (b.cantidad * b.porPrecio), 0);
  const costoInsumos = insumos.reduce((sum, i) => sum + (i.cantidad * i.porPrecio), 0);
  const costoEnsaladas = ensaladas.reduce((sum, e) => sum + (e.cantidad * e.porPrecio), 0);

  const caloriasTotales = [...proteinas, ...bebestibles, ...insumos, ...ensaladas]
    .reduce((sum, item) => sum + (item.cantidad * (item.calorias || 0)), 0);

  const costoTotal = costoProteinas + costoBebestibles + costoInsumos + costoEnsaladas;
  const costoPorPersona = cantidadParticipantes > 0 ? costoTotal / cantidadParticipantes : 0;
  const caloriasPorPersona = cantidadParticipantes > 0 ? caloriasTotales / cantidadParticipantes : 0;

  return {
    proteinas,
    bebestibles,
    insumos,
    ensaladas,
    costoTotal,
    costoPorPersona,
    caloriasTotales,
    caloriasPorPersona,
  };
};

type ItemCotizable = {
  nombre: string;
  categoria: 'proteina' | 'bebestible' | 'ensalada' | 'insumo';
  cantidad: number;
  subtotalBase: number;
  esAlcohol?: boolean;
};

export const generarCotizacionesSimuladas = (
  proteinas: Proteina[],
  bebestibles: Bebestibles[],
  ensaladas: Ensalada[],
  insumos: Insumos[],
): CotizacionSupermercado[] => {
  const items: ItemCotizable[] = [
    ...proteinas.map((item) => ({
      nombre: item.nombre,
      categoria: 'proteina' as const,
      cantidad: item.cantidad,
      subtotalBase: item.cantidad * item.porPrecio,
    })),
    ...bebestibles.map((item) => ({
      nombre: item.nombre,
      categoria: 'bebestible' as const,
      cantidad: item.cantidad,
      subtotalBase: item.cantidad * item.porPrecio,
      esAlcohol: item.tipo === 'cerveza',
    })),
    ...ensaladas.map((item) => ({
      nombre: item.nombre,
      categoria: 'ensalada' as const,
      cantidad: item.cantidad,
      subtotalBase: item.cantidad * item.porPrecio,
    })),
    ...insumos.map((item) => ({
      nombre: item.nombre,
      categoria: 'insumo' as const,
      cantidad: item.cantidad,
      subtotalBase: item.cantidad * item.porPrecio,
    })),
  ];

  const supermercados = [
    { nombre: 'Líder', factorBase: 0.98, categoriaExtra: { proteina: 1.0, bebestible: 0.99, ensalada: 1.02, insumo: 0.97 } },
    { nombre: 'Jumbo', factorBase: 1.07, categoriaExtra: { proteina: 1.03, bebestible: 1.02, ensalada: 1.01, insumo: 1.04 } },
    { nombre: 'Santa Isabel', factorBase: 1.01, categoriaExtra: { proteina: 0.99, bebestible: 1.0, ensalada: 0.98, insumo: 1.01 } },
  ] as const;

  return supermercados.map((supermercado, marketIndex) => {
    const detalles = items.map((item, itemIndex) => {
      const variacionDeterministica = 1 + (((itemIndex + 1) * (marketIndex + 2)) % 5 - 2) * 0.01;
      const factorCategoria = supermercado.categoriaExtra[item.categoria];
      const subtotal = roundMoney(item.subtotalBase * supermercado.factorBase * factorCategoria * variacionDeterministica);

      return {
        nombre: item.nombre,
        categoria: item.categoria,
        cantidad: item.cantidad,
        subtotal,
      };
    });

    const total = roundMoney(detalles.reduce((acc, item) => acc + item.subtotal, 0));
    const totalAlcohol = roundMoney(
      detalles.reduce((acc, detalle) => {
        const original = items.find((item) => item.nombre === detalle.nombre && item.categoria === detalle.categoria);
        return acc + (original?.esAlcohol ? detalle.subtotal : 0);
      }, 0),
    );

    return {
      supermercado: supermercado.nombre,
      total,
      totalAlcohol,
      detalles,
    };
  }).sort((a, b) => a.total - b.total);
};
