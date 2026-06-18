export interface Estado {
  id: number;
  nombre: string;
  ambitoId: number;
  ambito?: { id: number; descripcion: string; activo: boolean };
}

export interface CreateEstadoRequest {
  nombre: string;
  ambitoId: number;
}

export interface UpdateEstadoRequest {
  nombre?: string;
  ambitoId?: number;
}
