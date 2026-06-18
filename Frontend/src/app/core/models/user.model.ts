export interface User {
  id: number;
  username: string;
  email: string;
  fecha_creacion: string;
  rol_id: number;
  rol: Rol;
}

export interface Rol {
  id: number;
  nombre: string;
  permisos?: Permiso[];
}

export interface Permiso {
  id: number;
  nombre_opcion: string;
  ruta: string;
}

export interface CreateRolRequest {
  nombre: string;
  permiso_ids?: number[];
}

export interface UpdateRolRequest {
  nombre?: string;
  permiso_ids?: number[];
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  rol_id: number;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  rol_id?: number;
}
