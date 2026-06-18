export interface Proveedor {
  id: number;
  nombreProveedor: string;
  direccion: string | null;
  telefono: string | null;
  telefono2: string | null;
  email: string | null;
  activo: boolean;
}

export interface CreateProveedorRequest {
  nombreProveedor: string;
  direccion?: string;
  telefono?: string;
  telefono2?: string;
  email?: string;
  activo?: boolean;
}

export interface UpdateProveedorRequest {
  nombreProveedor?: string;
  direccion?: string;
  telefono?: string;
  telefono2?: string;
  email?: string;
  activo?: boolean;
}
