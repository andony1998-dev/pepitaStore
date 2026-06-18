export interface Cliente {
  id: number;
  nombre: string;
  nit: string | null;
  direccion: string | null;
  telefono: string | null;
  telefono2: string | null;
  email: string | null;
  activo: boolean;
}

export interface CreateClienteRequest {
  nombre: string;
  nit?: string;
  direccion?: string;
  telefono?: string;
  telefono2?: string;
  email?: string;
  activo?: boolean;
}

export interface UpdateClienteRequest {
  nombre?: string;
  nit?: string;
  direccion?: string;
  telefono?: string;
  telefono2?: string;
  email?: string;
  activo?: boolean;
}
