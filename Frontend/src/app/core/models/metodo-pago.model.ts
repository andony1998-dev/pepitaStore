export interface MetodoPago {
  id: number;
  descripcion: string;
  activo: boolean;
}

export interface CreateMetodoPagoRequest {
  descripcion: string;
  activo?: boolean;
}

export interface UpdateMetodoPagoRequest {
  descripcion?: string;
  activo?: boolean;
}
