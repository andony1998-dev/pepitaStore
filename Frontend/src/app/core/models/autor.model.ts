export interface Autor {
  id: number;
  nombre_completo: string;
  fecha_nacimiento: string | null;
  nacionalidad: string | null;
  genero_literario: string | null;
}

export interface CreateAutorRequest {
  nombre_completo: string;
  fecha_nacimiento?: string;
  nacionalidad?: string;
  genero_literario?: string;
}

export interface UpdateAutorRequest {
  nombre_completo?: string;
  fecha_nacimiento?: string;
  nacionalidad?: string;
  genero_literario?: string;
}
