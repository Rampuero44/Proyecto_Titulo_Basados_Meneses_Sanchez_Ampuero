import { Comercio, Precio, ProductWithPrice } from '../types/product';

export const comercios: Comercio[] = [
  { idComercio: 1, nombre: 'Jumbo',        enlace: 'https://www.jumbo.cl' },
  { idComercio: 2, nombre: 'Lider',        enlace: 'https://www.lider.cl' },
  { idComercio: 3, nombre: 'Santa Isabel', enlace: 'https://www.santaisabel.cl' },
  { idComercio: 4, nombre: 'Unimarc',      enlace: 'https://www.unimarc.cl' },
];

const J = comercios[0];
const L = comercios[1];
const S = comercios[2];
const U = comercios[3];

const p = (id: number, valor: number, comercio: Comercio): { precio: Precio; comercio: Comercio } => ({
  precio: { idPrecio: id, valor, fecha: new Date('2026-04-15'), idComercio: comercio.idComercio },
  comercio,
});

let nextId = 1;
const id = () => nextId++;

export const mockProducts: ProductWithPrice[] = [

  // ──────────────────────────────────────────────────────────────
  // PROTEÍNAS — VACUNO MAGRO
  // ──────────────────────────────────────────────────────────────
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno magro',  nombre: 'Posta negra',         cantidad: 1, idPrecio: 1,  calorias: 110, ...p(1,  11990, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno magro',  nombre: 'Posta rosada',        cantidad: 1, idPrecio: 2,  calorias: 112, ...p(2,  13500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno magro',  nombre: 'Posta paleta',        cantidad: 1, idPrecio: 3,  calorias: 108, ...p(3,  11000, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno magro',  nombre: 'Asiento',             cantidad: 1, idPrecio: 4,  calorias: 106, ...p(4,  11500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno magro',  nombre: 'Choclillo',           cantidad: 1, idPrecio: 5,  calorias: 130, ...p(5,  12500, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno magro',  nombre: 'Pollo ganso',         cantidad: 1, idPrecio: 6,  calorias: 140, ...p(6,  11000, S) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno magro',  nombre: 'Abastero',            cantidad: 1, idPrecio: 7,  calorias: 150, ...p(7,  11500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno magro',  nombre: 'Punta paleta',        cantidad: 1, idPrecio: 8,  calorias: 150, ...p(8,  12000, L) },

  // VACUNO INTERMEDIO
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno intermedio', nombre: 'Sobrecostilla',   cantidad: 1, idPrecio: 9,  calorias: 200, ...p(9,  12000, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno intermedio', nombre: 'Huachalomo',      cantidad: 1, idPrecio: 10, calorias: 200, ...p(10, 12000, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno intermedio', nombre: 'Plateada',        cantidad: 1, idPrecio: 11, calorias: 200, ...p(11, 12500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno intermedio', nombre: 'Punta de ganso',  cantidad: 1, idPrecio: 12, calorias: 180, ...p(12, 16500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno intermedio', nombre: 'Malaya',          cantidad: 1, idPrecio: 13, calorias: 225, ...p(13, 12000, S) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno intermedio', nombre: 'Osobuco',         cantidad: 1, idPrecio: 14, calorias: 200, ...p(14, 11000, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno intermedio', nombre: 'Entraña',         cantidad: 1, idPrecio: 15, calorias: 225, ...p(15, 23000, J) },

  // VACUNO PREMIUM
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno premium', nombre: 'Lomo liso',          cantidad: 1, idPrecio: 16, calorias: 245, ...p(16, 23000, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno premium', nombre: 'Lomo vetado',        cantidad: 1, idPrecio: 17, calorias: 275, ...p(17, 21500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno premium', nombre: 'Filete',             cantidad: 1, idPrecio: 18, calorias: 225, ...p(18, 24000, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno premium', nombre: 'Asado de tira',      cantidad: 1, idPrecio: 19, calorias: 275, ...p(19, 12500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno premium', nombre: 'Costillar vacuno',   cantidad: 1, idPrecio: 20, calorias: 300, ...p(20, 11500, S) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno premium', nombre: 'Punta picana',       cantidad: 1, idPrecio: 21, calorias: 275, ...p(21, 15000, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno premium', nombre: 'Palanca',            cantidad: 1, idPrecio: 22, calorias: 240, ...p(22, 19000, L) },

  // VACUNO OTROS
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno otros', nombre: 'Carne molida corriente', cantidad: 1, idPrecio: 23, calorias: 270, ...p(23, 7500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno otros', nombre: 'Carne molida magra',     cantidad: 1, idPrecio: 24, calorias: 130, ...p(24, 11000, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Vacuno otros', nombre: 'Lengua de vacuno',       cantidad: 1, idPrecio: 25, calorias: 235, ...p(25, 10000, S) },

  // ──────────────────────────────────────────────────────────────
  // PROTEÍNAS — CERDO
  // ──────────────────────────────────────────────────────────────
  // Cerdo magro
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo magro',        nombre: 'Lomo centro',            cantidad: 1, idPrecio: 30, calorias: 155, ...p(30, 6990,  J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo magro',        nombre: 'Filete (solomillo)',      cantidad: 1, idPrecio: 31, calorias: 150, ...p(31, 6490,  L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo magro',        nombre: 'Pulpa pierna',           cantidad: 1, idPrecio: 32, calorias: 165, ...p(32, 5490,  J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo magro',        nombre: 'Pulpa paleta',           cantidad: 1, idPrecio: 33, calorias: 175, ...p(33, 5490,  S) },
  // Cerdo intermedio
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo intermedio',   nombre: 'Chuleta centro',         cantidad: 1, idPrecio: 34, calorias: 225, ...p(34, 4490,  J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo intermedio',   nombre: 'Chuleta vetada',         cantidad: 1, idPrecio: 35, calorias: 275, ...p(35, 4990,  L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo intermedio',   nombre: 'Pierna entera',          cantidad: 1, idPrecio: 36, calorias: 200, ...p(36, 4490,  J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo intermedio',   nombre: 'Pernil',                 cantidad: 1, idPrecio: 37, calorias: 225, ...p(37, 4000,  S) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo intermedio',   nombre: 'Paleta entera',          cantidad: 1, idPrecio: 38, calorias: 225, ...p(38, 4990,  L) },
  // Cerdo premium
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo premium',      nombre: 'Costillar',              cantidad: 1, idPrecio: 39, calorias: 325, ...p(39, 8490,  J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo premium',      nombre: 'Panceta (tocino)',        cantidad: 1, idPrecio: 40, calorias: 450, ...p(40, 7490,  J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo premium',      nombre: 'Malaya de cerdo',        cantidad: 1, idPrecio: 41, calorias: 400, ...p(41, 10990, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo premium',      nombre: 'Costillar con panceta',  cantidad: 1, idPrecio: 42, calorias: 400, ...p(42, 8990,  J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo premium',      nombre: 'Papada de cerdo',        cantidad: 1, idPrecio: 43, calorias: 400, ...p(43, 3200,  U) },
  // Cerdo otros
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo otros',        nombre: 'Longaniza artesanal',    cantidad: 1, idPrecio: 44, calorias: 325, ...p(44, 5990,  U) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo otros',        nombre: 'Prietas',                cantidad: 1, idPrecio: 45, calorias: 350, ...p(45, 4990,  S) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo otros',        nombre: 'Hígado de cerdo',        cantidad: 1, idPrecio: 46, calorias: 145, ...p(46, 3000,  J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo otros',        nombre: 'Patitas de cerdo',       cantidad: 1, idPrecio: 47, calorias: 200, ...p(47, 2200,  L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cerdo otros',        nombre: 'Cuero de cerdo',         cantidad: 1, idPrecio: 48, calorias: 275, ...p(48, 3500,  U) },

  // ──────────────────────────────────────────────────────────────
  // PROTEÍNAS — POLLO / AVE
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pollo magro', nombre: 'Pechuga sin piel',       cantidad: 1, idPrecio: 40, calorias: 195, ...p(40, 6500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pollo magro', nombre: 'Filetillo de pechuga',   cantidad: 1, idPrecio: 41, calorias: 125, ...p(41, 7000, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pollo magro', nombre: 'Pechuga deshuesada',    cantidad: 1, idPrecio: 42, calorias: 165, ...p(42, 6500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pollo magro', nombre: 'Pollo molido magro',    cantidad: 1, idPrecio: 43, calorias: 160, ...p(43, 6000, S) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pollo intermedio', nombre: 'Trutro largo',      cantidad: 1, idPrecio: 44, calorias: 135, ...p(44, 3990, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pollo intermedio', nombre: 'Trutro corto',      cantidad: 1, idPrecio: 45, calorias: 180, ...p(45, 3990, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pollo intermedio', nombre: 'Trutro entero',     cantidad: 1, idPrecio: 46, calorias: 165, ...p(46, 4500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pollo intermedio', nombre: 'Pollo entero',      cantidad: 1, idPrecio: 47, calorias: 175, ...p(47, 3300, S) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pollo intermedio', nombre: 'Pollo mariposa',    cantidad: 1, idPrecio: 48, calorias: 175, ...p(48, 3800, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pollo premium', nombre: 'Alitas de pollo',      cantidad: 1, idPrecio: 49, calorias: 171, ...p(49, 4500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pollo premium', nombre: 'Muslo con piel',       cantidad: 1, idPrecio: 50, calorias: 215, ...p(50, 4000, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pollo premium', nombre: 'Trutro ala',           cantidad: 1, idPrecio: 51, calorias: 157, ...p(51, 4500, S) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pollo premium', nombre: 'Pollo con piel entero',cantidad: 1, idPrecio: 52, calorias: 225, ...p(52, 3500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pollo otros', nombre: 'Menudencias de pollo',  cantidad: 1, idPrecio: 53, calorias: 140, ...p(53, 3000, U) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pollo otros', nombre: 'Garras de pollo',       cantidad: 1, idPrecio: 54, calorias: 150, ...p(54, 2000, S) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pollo otros', nombre: 'Nuggets de pollo',      cantidad: 1, idPrecio: 55, calorias: 275, ...p(55, 6500, J) },
  // ──────────────────────────────────────────────────────────────
  // PROTEÍNAS — CORDERO
  // ──────────────────────────────────────────────────────────────
  // Cordero magro
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cordero magro',      nombre: 'Pierna deshuesada',        cantidad: 1, idPrecio: 50, calorias: 185, ...p(50, 22000, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cordero magro',      nombre: 'Lomo de cordero',          cantidad: 1, idPrecio: 51, calorias: 175, ...p(51, 22000, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cordero magro',      nombre: 'Filete de cordero',        cantidad: 1, idPrecio: 52, calorias: 165, ...p(52, 24500, J) },
  // Cordero intermedio
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cordero intermedio', nombre: 'Paleta de cordero',        cantidad: 1, idPrecio: 53, calorias: 225, ...p(53, 11000, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cordero intermedio', nombre: 'Pierna con hueso',         cantidad: 1, idPrecio: 54, calorias: 225, ...p(54, 17000, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cordero intermedio', nombre: 'Garrón de cordero',        cantidad: 1, idPrecio: 55, calorias: 240, ...p(55, 17000, S) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cordero intermedio', nombre: 'Cuarto de cordero',        cantidad: 1, idPrecio: 56, calorias: 240, ...p(56, 10500, J) },
  // Cordero premium
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cordero premium',    nombre: 'Costillar de cordero',     cantidad: 1, idPrecio: 57, calorias: 305, ...p(57, 17000, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cordero premium',    nombre: 'Chuletas francesa',        cantidad: 1, idPrecio: 58, calorias: 275, ...p(58, 31000, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cordero premium',    nombre: 'Entrecot de cordero',      cantidad: 1, idPrecio: 59, calorias: 300, ...p(59, 18000, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cordero premium',    nombre: 'Costillar con vacío',      cantidad: 1, idPrecio: 60, calorias: 325, ...p(60, 11500, S) },
  // Cordero otros
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cordero otros',      nombre: 'Cordero entero',           cantidad: 1, idPrecio: 61, calorias: 250, ...p(61, 15990, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cordero otros',      nombre: 'Cordero trozado',          cantidad: 1, idPrecio: 62, calorias: 250, ...p(62, 14000, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Cordero otros',      nombre: 'Menudencias de cordero',   cantidad: 1, idPrecio: 63, calorias: 150, ...p(63, 5500,  U) },

  // ──────────────────────────────────────────────────────────────
  // PROTEÍNAS — PESCADOS Y MARISCOS
  // ──────────────────────────────────────────────────────────────
  // Pescado magro
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pescado magro',       nombre: 'Merluza',             cantidad: 1, idPrecio: 60, calorias: 100, ...p(60,  5500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pescado magro',       nombre: 'Reineta',             cantidad: 1, idPrecio: 61, calorias: 110, ...p(61,  7500, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pescado magro',       nombre: 'Jurel',               cantidad: 1, idPrecio: 62, calorias: 120, ...p(62,  4000, S) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pescado magro',       nombre: 'Pescada',             cantidad: 1, idPrecio: 63, calorias: 100, ...p(63,  5000, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pescado magro',       nombre: 'Lenguado',            cantidad: 1, idPrecio: 64, calorias: 100, ...p(64, 15000, L) },
  // Pescado intermedio
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pescado intermedio',  nombre: 'Corvina',             cantidad: 1, idPrecio: 65, calorias: 120, ...p(65, 11000, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pescado intermedio',  nombre: 'Congrio',             cantidad: 1, idPrecio: 66, calorias: 135, ...p(66, 13000, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pescado intermedio',  nombre: 'Sierra',              cantidad: 1, idPrecio: 67, calorias: 150, ...p(67,  8000, S) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pescado intermedio',  nombre: 'Pejerrey',            cantidad: 1, idPrecio: 68, calorias: 125, ...p(68,  7000, J) },
  // Pescado graso
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pescado graso',       nombre: 'Salmón',              cantidad: 1, idPrecio: 69, calorias: 200, ...p(69, 12000, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pescado graso',       nombre: 'Atún fresco',         cantidad: 1, idPrecio: 70, calorias: 190, ...p(70, 11000, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Pescado graso',       nombre: 'Caballa',             cantidad: 1, idPrecio: 71, calorias: 215, ...p(71,  6000, S) },
  // Marisco magro
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Marisco magro',       nombre: 'Almejas',             cantidad: 1, idPrecio: 72, calorias: 80,  ...p(72,  8000, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Marisco magro',       nombre: 'Choritos (mejillones)',cantidad: 1, idPrecio: 73, calorias: 85,  ...p(73,  3500, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Marisco magro',       nombre: 'Machas',              cantidad: 1, idPrecio: 74, calorias: 90,  ...p(74, 11000, S) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Marisco magro',       nombre: 'Ostiones',            cantidad: 1, idPrecio: 75, calorias: 80,  ...p(75, 14000, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Marisco magro',       nombre: 'Erizos',              cantidad: 1, idPrecio: 76, calorias: 100, ...p(76, 20000, L) },
  // Marisco intermedio
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Marisco intermedio',  nombre: 'Camarones',           cantidad: 1, idPrecio: 77, calorias: 110, ...p(77, 12000, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Marisco intermedio',  nombre: 'Langostinos',         cantidad: 1, idPrecio: 78, calorias: 120, ...p(78, 14000, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Marisco intermedio',  nombre: 'Jaiba',               cantidad: 1, idPrecio: 79, calorias: 120, ...p(79,  9000, S) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Marisco intermedio',  nombre: 'Pulpo',               cantidad: 1, idPrecio: 80, calorias: 90,  ...p(80, 16000, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Marisco intermedio',  nombre: 'Calamar',             cantidad: 1, idPrecio: 81, calorias: 100, ...p(81,  8000, L) },

  // ──────────────────────────────────────────────────────────────
  // PROTEÍNAS — EMBUTIDOS E INTERIORES
  // ──────────────────────────────────────────────────────────────
  // Embutidos grasos
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Embutidos',          nombre: 'Longaniza',               cantidad: 1, idPrecio: 85, calorias: 325, ...p(85,  6500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Embutidos',          nombre: 'Chorizo parrillero',      cantidad: 1, idPrecio: 86, calorias: 325, ...p(86,  7000, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Embutidos',          nombre: 'Salchichas',              cantidad: 1, idPrecio: 87, calorias: 275, ...p(87,  4500, S) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Embutidos',          nombre: 'Prietas',                 cantidad: 1, idPrecio: 88, calorias: 325, ...p(88,  5500, J) },
  // Interiores magros
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Interiores magros',  nombre: 'Hígado de vacuno',        cantidad: 1, idPrecio: 89, calorias: 145, ...p(89,  3500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Interiores magros',  nombre: 'Riñón de vacuno',         cantidad: 1, idPrecio: 90, calorias: 110, ...p(90,  3000, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Interiores magros',  nombre: 'Corazón de vacuno',       cantidad: 1, idPrecio: 91, calorias: 130, ...p(91,  3500, S) },
  // Interiores intermedios
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Interiores intermedios', nombre: 'Lengua de vacuno',    cantidad: 1, idPrecio: 92, calorias: 235, ...p(92,  9500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Interiores intermedios', nombre: 'Guatitas (mondongo)', cantidad: 1, idPrecio: 93, calorias: 105, ...p(93,  4500, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Interiores intermedios', nombre: 'Panita de pollo',     cantidad: 1, idPrecio: 94, calorias: 140, ...p(94,  3000, S) },
  // Interiores parrilleros
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Interiores parrilleros', nombre: 'Sesos',               cantidad: 1, idPrecio: 95, calorias: 150, ...p(95,  4500, J) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Interiores parrilleros', nombre: 'Ubre',                cantidad: 1, idPrecio: 96, calorias: 200, ...p(96,  4000, L) },
  { id: id(), idProteina: id(), idEvento: 1, category: 'proteina', tipo: 'Interiores parrilleros', nombre: 'Chunchules',          cantidad: 1, idPrecio: 97, calorias: 275, ...p(97,  5500, J) },

  // ──────────────────────────────────────────────────────────────
  // BEBESTIBLES
  // ──────────────────────────────────────────────────────────────

  // Gaseosas
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Gaseosa', nombre: 'Coca Cola 3L',          formato: 'botella', cantidad: 1, idPrecio: 200, calorias: 390, ...p(200, 2090, J) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Gaseosa', nombre: 'Coca Cola Zero 3L',     formato: 'botella', cantidad: 1, idPrecio: 201, calorias: 3,   ...p(201, 2090, L) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Gaseosa', nombre: 'Sprite 3L',             formato: 'botella', cantidad: 1, idPrecio: 202, calorias: 330, ...p(202, 1990, J) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Gaseosa', nombre: 'Fanta Naranja 3L',      formato: 'botella', cantidad: 1, idPrecio: 203, calorias: 360, ...p(203, 1990, S) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Gaseosa', nombre: 'Pepsi 3L',              formato: 'botella', cantidad: 1, idPrecio: 204, calorias: 370, ...p(204, 1890, L) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Gaseosa', nombre: 'Kem Naranja 3L',        formato: 'botella', cantidad: 1, idPrecio: 205, calorias: 350, ...p(205, 1790, S) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Gaseosa', nombre: 'Bebida Energética Red Bull 250cc', formato: 'lata', cantidad: 1, idPrecio: 206, calorias: 110, ...p(206, 1590, J) },

  // Jugos y néctares
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Jugo', nombre: 'Jugo Watts Naranja 1L',     formato: 'caja',    cantidad: 1, idPrecio: 210, calorias: 110, ...p(210, 1290, J) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Jugo', nombre: 'Jugo Watts Durazno 1L',    formato: 'caja',    cantidad: 1, idPrecio: 211, calorias: 115, ...p(211, 1290, L) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Jugo', nombre: 'Néctar Vivo Naranja 1L',   formato: 'caja',    cantidad: 1, idPrecio: 212, calorias: 105, ...p(212, 1000, S) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Jugo', nombre: 'Lipton Ice Tea Limón 1.5L',formato: 'botella', cantidad: 1, idPrecio: 213, calorias: 135, ...p(213, 1490, J) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Jugo', nombre: 'Jugo natural naranja 1L',  formato: 'botella', cantidad: 1, idPrecio: 214, calorias: 112, ...p(214, 2490, U) },

  // Aguas
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Agua', nombre: 'Agua Cachantun 1.6L',      formato: 'botella', cantidad: 1, idPrecio: 220, calorias: 0, ...p(220,  990, J) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Agua', nombre: 'Agua Cachantun 5L',        formato: 'botella', cantidad: 1, idPrecio: 221, calorias: 0, ...p(221, 1990, L) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Agua', nombre: 'Agua Mineral Manantial 1.5L',formato: 'botella',cantidad: 1, idPrecio: 222, calorias: 0, ...p(222,  890, S) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Agua', nombre: 'Agua Saborizada MAS Limón 1.5L',formato: 'botella',cantidad: 1, idPrecio: 223, calorias: 55, ...p(223, 1190, J) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Agua', nombre: 'H2OH Lima Limón 600cc',    formato: 'botella', cantidad: 1, idPrecio: 224, calorias: 25, ...p(224,  950, L) },

  // Cervezas
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Cerveza', nombre: 'Cristal lata 350cc',         formato: 'lata',    cantidad: 1, idPrecio: 230, calorias: 147, ...p(230,  590, J) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Cerveza', nombre: 'Escudo lata 350cc',          formato: 'lata',    cantidad: 1, idPrecio: 231, calorias: 147, ...p(231,  590, L) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Cerveza', nombre: 'Cristal pack 12 latas 350cc',formato: 'lata',    cantidad: 1, idPrecio: 232, calorias: 147, ...p(232, 5690, J) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Cerveza', nombre: 'Heineken lata 473cc',        formato: 'lata',    cantidad: 1, idPrecio: 233, calorias: 200, ...p(233, 1190, J) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Cerveza', nombre: 'Patagonia Lager lata 470cc', formato: 'lata',    cantidad: 1, idPrecio: 234, calorias: 198, ...p(234, 1090, L) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Cerveza', nombre: 'Kunstmann Torobayo 1L',      formato: 'botella', cantidad: 1, idPrecio: 235, calorias: 420, ...p(235, 2490, S) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Cerveza', nombre: 'Austral Patagonia Blonde 470cc',formato: 'lata', cantidad: 1, idPrecio: 236, calorias: 198, ...p(236, 1000, U) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Cerveza', nombre: 'Guayacán IPA 330cc',         formato: 'botella', cantidad: 1, idPrecio: 237, calorias: 165, ...p(237, 1590, J) },

  // Vinos
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Vino', nombre: 'Casillero del Diablo Cab.Sauv 750cc', formato: 'botella', cantidad: 1, idPrecio: 240, calorias: 510, ...p(240, 4990, J) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Vino', nombre: 'Santa Rita 120 Carménère 750cc',       formato: 'botella', cantidad: 1, idPrecio: 241, calorias: 500, ...p(241, 3590, L) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Vino', nombre: 'Gran 120 Red Blend 1.5L',              formato: 'botella', cantidad: 1, idPrecio: 242, calorias: 990, ...p(242, 3590, S) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Vino', nombre: 'Concha y Toro Frontera 1.5L',          formato: 'botella', cantidad: 1, idPrecio: 243, calorias: 975, ...p(243, 3290, J) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Vino', nombre: 'Espumante Valdivieso Brut 750cc',      formato: 'botella', cantidad: 1, idPrecio: 244, calorias: 490, ...p(244, 3990, L) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Vino', nombre: 'Arboleda Cabernet Sauvignon 750cc',    formato: 'botella', cantidad: 1, idPrecio: 245, calorias: 520, ...p(245, 9990, J) },

  // Pisco y destilados chilenos
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Pisco', nombre: 'Pisco Control 35° 750cc',      formato: 'botella', cantidad: 1, idPrecio: 250, calorias: 1590, ...p(250, 6990, J) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Pisco', nombre: 'Pisco Alto del Carmen 35° 750cc',formato: 'botella',cantidad: 1, idPrecio: 251, calorias: 1590, ...p(251, 6490, L) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Pisco', nombre: 'Pisco Mistral Nobel 40° 750cc', formato: 'botella', cantidad: 1, idPrecio: 252, calorias: 1820, ...p(252, 8490, S) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Pisco', nombre: 'Valle Luna Artesanal 35° 750cc',formato: 'botella', cantidad: 1, idPrecio: 253, calorias: 1590, ...p(253, 6990, U) },

  // Licores y destilados importados
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Licor', nombre: 'Whisky Johnnie Walker Red 750cc',  formato: 'botella', cantidad: 1, idPrecio: 260, calorias: 1785, ...p(260,  9990, J) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Licor', nombre: 'Ron Bacardí Blanco 750cc',         formato: 'botella', cantidad: 1, idPrecio: 261, calorias: 1650, ...p(261,  8990, L) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Licor', nombre: 'Tequila Jose Cuervo Silver 700cc', formato: 'botella', cantidad: 1, idPrecio: 262, calorias: 1540, ...p(262, 10880, J) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Licor', nombre: 'Gin Bombay Sapphire 750cc',        formato: 'botella', cantidad: 1, idPrecio: 263, calorias: 1575, ...p(263, 14990, S) },
  { id: id(), idBebestible: id(), idEvento: 1, category: 'bebestible', tipo: 'Licor', nombre: 'Vodka Stolichnaya 750cc',          formato: 'botella', cantidad: 1, idPrecio: 264, calorias: 1540, ...p(264, 11990, L) },

  // INSUMOS
  // ──────────────────────────────────────────────────────────────
  { id: id(), idInsumo: id(), idEvento: 1, category: 'insumo', tipo: 'Combustible', nombre: 'Carbón vegetal 5kg',          cantidad: 1, idPrecio: 90, calorias: 0, ...p(90, 3990, J) },
  { id: id(), idInsumo: id(), idEvento: 1, category: 'insumo', tipo: 'Combustible', nombre: 'Leña seca 5kg',               cantidad: 1, idPrecio: 91, calorias: 0, ...p(91, 2990, U) },
  { id: id(), idInsumo: id(), idEvento: 1, category: 'insumo', tipo: 'Combustible', nombre: 'Encendedor de carbón',        cantidad: 1, idPrecio: 92, calorias: 0, ...p(92, 1490, J) },
  { id: id(), idInsumo: id(), idEvento: 1, category: 'insumo', tipo: 'Condimento',  nombre: 'Sal de mar gruesa',           cantidad: 1, idPrecio: 93, calorias: 0, ...p(93, 1990, L) },
  { id: id(), idInsumo: id(), idEvento: 1, category: 'insumo', tipo: 'Condimento',  nombre: 'Chimichurri',                 cantidad: 1, idPrecio: 94, calorias: 45, ...p(94, 2490, J) },
  { id: id(), idInsumo: id(), idEvento: 1, category: 'insumo', tipo: 'Condimento',  nombre: 'Merquén',                     cantidad: 1, idPrecio: 95, calorias: 20, ...p(95, 1990, S) },
  { id: id(), idInsumo: id(), idEvento: 1, category: 'insumo', tipo: 'Condimento',  nombre: 'Aliño completo',              cantidad: 1, idPrecio: 96, calorias: 10, ...p(96, 990,  L) },
  { id: id(), idInsumo: id(), idEvento: 1, category: 'insumo', tipo: 'Utensilio',   nombre: 'Platos desechables 50 un.',   cantidad: 1, idPrecio: 97, calorias: 0, ...p(97, 2490, J) },
  { id: id(), idInsumo: id(), idEvento: 1, category: 'insumo', tipo: 'Utensilio',   nombre: 'Vasos desechables 50 un.',    cantidad: 1, idPrecio: 98, calorias: 0, ...p(98, 1990, L) },
  { id: id(), idInsumo: id(), idEvento: 1, category: 'insumo', tipo: 'Utensilio',   nombre: 'Cubiertos desechables 50 un.',cantidad: 1, idPrecio: 99, calorias: 0, ...p(99, 2290, S) },
  { id: id(), idInsumo: id(), idEvento: 1, category: 'insumo', tipo: 'Utensilio',   nombre: 'Servilletas paquete',         cantidad: 1, idPrecio: 100,calorias: 0, ...p(100,990,  J) },
  { id: id(), idInsumo: id(), idEvento: 1, category: 'insumo', tipo: 'Utensilio',   nombre: 'Papel aluminio',              cantidad: 1, idPrecio: 101,calorias: 0, ...p(101,1490, L) },

  // ──────────────────────────────────────────────────────────────
  // ENSALADAS
  // ──────────────────────────────────────────────────────────────
  { id: id(), idEnsalada: id(), idEvento: 1, category: 'ensalada', tipo: 'Verdura',    nombre: 'Lechuga costina',       cantidad: 1, idPrecio: 110, calorias: 15,  ...p(110, 990,  J) },
  { id: id(), idEnsalada: id(), idEvento: 1, category: 'ensalada', tipo: 'Verdura',    nombre: 'Tomate cherry',         cantidad: 1, idPrecio: 111, calorias: 18,  ...p(111, 1490, L) },
  { id: id(), idEnsalada: id(), idEvento: 1, category: 'ensalada', tipo: 'Verdura',    nombre: 'Pepino ensalada',       cantidad: 1, idPrecio: 112, calorias: 16,  ...p(112, 990,  S) },
  { id: id(), idEnsalada: id(), idEvento: 1, category: 'ensalada', tipo: 'Verdura',    nombre: 'Cebolla morada',        cantidad: 1, idPrecio: 113, calorias: 40,  ...p(113, 790,  J) },
  { id: id(), idEnsalada: id(), idEvento: 1, category: 'ensalada', tipo: 'Fruta',      nombre: 'Palta Hass',            cantidad: 1, idPrecio: 114, calorias: 160, ...p(114, 7990, J) },
  { id: id(), idEnsalada: id(), idEvento: 1, category: 'ensalada', tipo: 'Fruta',      nombre: 'Limón de pica',         cantidad: 1, idPrecio: 115, calorias: 29,  ...p(115, 990,  L) },
  { id: id(), idEnsalada: id(), idEvento: 1, category: 'ensalada', tipo: 'Mix',        nombre: 'Mix de hojas verdes',   cantidad: 1, idPrecio: 116, calorias: 20,  ...p(116, 1990, J) },
  { id: id(), idEnsalada: id(), idEvento: 1, category: 'ensalada', tipo: 'Mix',        nombre: 'Ensalada chilena mix',  cantidad: 1, idPrecio: 117, calorias: 35,  ...p(117, 2490, S) },
  { id: id(), idEnsalada: id(), idEvento: 1, category: 'ensalada', tipo: 'Aderezo',    nombre: 'Aceite de oliva',       cantidad: 1, idPrecio: 118, calorias: 120, ...p(118, 3990, J) },
  { id: id(), idEnsalada: id(), idEvento: 1, category: 'ensalada', tipo: 'Aderezo',    nombre: 'Vinagre de vino',       cantidad: 1, idPrecio: 119, calorias: 5,   ...p(119, 1290, L) },
];

export function getAllPricesForProduct(productId: number): Array<{ precio: Precio; comercio: Comercio }> {
  const product = mockProducts.find(p => p.id === productId);
  if (!product) return [];
  return [
    { precio: product.precio, comercio: product.comercio },
    { precio: { ...product.precio, idPrecio: product.precio.idPrecio + 100, valor: product.precio.valor + 500, idComercio: 2 }, comercio: comercios[1] },
    { precio: { ...product.precio, idPrecio: product.precio.idPrecio + 200, valor: product.precio.valor - 300, idComercio: 3 }, comercio: comercios[2] },
  ];
}