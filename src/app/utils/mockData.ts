import { Comercio } from './localStorage';

export const comerciosMock: Comercio[] = [
  {
    id: 1,
    nombre: 'Supermercado El Ahorro',
    ubicacion: 'Av. Principal 123',
  },
  {
    id: 2,
    nombre: 'Carnicería Don José',
    ubicacion: 'Calle 45 #678',
  },
  {
    id: 3,
    nombre: 'Mayorista Los Andes',
    ubicacion: 'Av. Industrial 890',
  },
];

// Inicializar comercios en localStorage si no existen
export const initializeMockData = () => {
  const comercios = localStorage.getItem('comercios');
  if (!comercios) {
    localStorage.setItem('comercios', JSON.stringify(comerciosMock));
  }
};
