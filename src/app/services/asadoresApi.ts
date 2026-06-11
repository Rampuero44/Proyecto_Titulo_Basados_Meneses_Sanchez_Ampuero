import { apiFetch } from "../utils/apiClient";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export interface MaestroParrillero {
  idMaestro: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  descripcion: string;
  experienciaAnos: number;
  valorServicio: number;
  disponibilidad: boolean;
  puntuacion: number;
}

export async function obtenerMaestros(): Promise<MaestroParrillero[]> {
  const response = await apiFetch(`${API_BASE_URL}/maestros-parrilleros`);
  if (!response.ok) throw new Error("No se pudieron cargar los maestros asadores");
  return response.json();
}

export async function obtenerMaestro(id: number): Promise<MaestroParrillero> {
  const response = await apiFetch(`${API_BASE_URL}/maestros-parrilleros/${id}`);
  if (!response.ok) throw new Error("No se encontró el maestro asador");
  return response.json();
}