export interface DetalleMovimiento {
  id: number;
  movimientoId: number;
  libroId: number;
  libro?: { id: number; titulo: string; isbn: string; precio: number; stock: number };
  cantidad: number;
  precioUnitario: number;
  porcentajeDescuento: number;
  precioFinal: number;
}

export interface Movimiento {
  id: number;
  tipoMovimientoId: number;
  tipoMovimiento?: { id: number; descripcion: string; operacion: 1 | -1 };
  fecha: string;
  clienteId: number | null;
  cliente?: { id: number; nombre: string } | null;
  proveedorId: number | null;
  proveedor?: { id: number; nombreProveedor: string } | null;
  estadoId: number;
  estado?: { id: number; nombre: string };
  usuario: string;
  eventoId: number | null;
  evento?: { id: number; nombre: string } | null;
  detalles: DetalleMovimiento[];
}

export interface CreateDetalleRequest {
  libroId: number;
  cantidad: number;
  precioUnitario: number;
  porcentajeDescuento?: number;
  precioFinal: number;
}

export interface CreateMovimientoRequest {
  tipoMovimientoId: number;
  fecha?: string;
  clienteId?: number;
  proveedorId?: number;
  estadoId: number;
  eventoId?: number;
  detalles: CreateDetalleRequest[];
}
