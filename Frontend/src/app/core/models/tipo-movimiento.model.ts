export interface TipoMovimiento {
  id: number;
  descripcion: string;
  activo: boolean;
  operacion: 1 | -1;
}

export interface CreateTipoMovimientoRequest {
  descripcion: string;
  activo?: boolean;
  operacion: 1 | -1;
}

export interface UpdateTipoMovimientoRequest {
  descripcion?: string;
  activo?: boolean;
  operacion?: 1 | -1;
}
