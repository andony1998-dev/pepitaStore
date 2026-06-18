export interface Ambito {
  id: number;
  descripcion: string;
  activo: boolean;
}

export interface CreateAmbitoRequest {
  descripcion: string;
  activo?: boolean;
}

export interface UpdateAmbitoRequest {
  descripcion?: string;
  activo?: boolean;
}
