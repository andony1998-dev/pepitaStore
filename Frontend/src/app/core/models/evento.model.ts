export interface Evento {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface CreateEventoRequest {
  nombre: string;
  activo?: boolean;
}

export interface UpdateEventoRequest {
  nombre?: string;
  activo?: boolean;
}
