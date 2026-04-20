import { storage, generateId } from './localStorage';
import { initializeMockData } from './mockData';

const buildDemoEvent = (usuarioId: number) => {
  const eventoDemoId = generateId();
  return {
    id: eventoDemoId,
    nombre: 'Evento de Juan',
    fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    presupuesto: 85000,
    estado: 'planificado' as const,
    usuarioId,
    participantes: [
      {
        id: generateId(),
        nombre: 'Juan',
        contactos: [{ id: generateId(), metodo: 'email', valor: 'juan@gmail.com' }],
      },
      {
        id: generateId(),
        nombre: 'María González',
        contactos: [{ id: generateId(), metodo: 'email', valor: 'maria@example.com' }],
      },
      {
        id: generateId(),
        nombre: 'Carlos Rodríguez',
        contactos: [],
      },
    ],
    proteinas: [
      { id: generateId(), eventoId: eventoDemoId, tipo: 'carne', cantidad: 1.5, nombre: 'Lomo Vetado (kg)', porPrecio: 8000 },
      { id: generateId(), eventoId: eventoDemoId, tipo: 'chorizo', cantidad: 6, nombre: 'Chorizo', porPrecio: 800 },
    ],
    bebestibles: [
      { id: generateId(), eventoId: eventoDemoId, tipo: 'cerveza', cantidad: 2, nombre: 'Cerveza (pack 6)', porPrecio: 6000 },
      { id: generateId(), eventoId: eventoDemoId, tipo: 'gaseosa', cantidad: 1, nombre: 'Gaseosa 2L', porPrecio: 2500 },
    ],
    insumos: [
      { id: generateId(), eventoId: eventoDemoId, tipo: 'carbon', cantidad: 1, nombre: 'Carbón', porPrecio: 5000 },
      { id: generateId(), eventoId: eventoDemoId, tipo: 'pan', cantidad: 1, nombre: 'Pan (bolsa 10)', porPrecio: 2000 },
    ],
    ensaladas: [
      { id: generateId(), eventoId: eventoDemoId, tipo: 'mixta', cantidad: 1, nombre: 'Ensalada mixta', porPrecio: 4000 },
    ],
    createdAt: new Date().toISOString(),
  };
};

export const initializeData = () => {
  initializeMockData();

  const usuarios = storage.getUsuarios();
  let usuarioDemo = usuarios.find((usuario) => usuario.email === 'juan@gmail.com');

  if (!usuarioDemo) {
    usuarioDemo = {
      id: generateId(),
      nombre: 'Juan',
      email: 'juan@gmail.com',
      password: 'juan123',
      rol: 'usuario' as const,
    };
    storage.saveUsuario(usuarioDemo);
  }

  const eventos = storage.getUsuarioEventos(usuarioDemo.id);
  if (eventos.length === 0) {
    storage.saveEvento(buildDemoEvent(usuarioDemo.id));
  }
};
