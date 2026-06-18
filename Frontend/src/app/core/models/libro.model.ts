import { Autor } from './autor.model';

export interface Libro {
  id: number;
  titulo: string;
  isbn: string;
  fecha_publicacion: string | null;
  precio: number;
  stock: number;
  autor_id: number;
  autor: Autor;
}

export interface CreateLibroRequest {
  titulo: string;
  isbn: string;
  fecha_publicacion?: string;
  precio: number;
  stock: number;
  autor_id: number;
}

export interface UpdateLibroRequest {
  titulo?: string;
  isbn?: string;
  fecha_publicacion?: string;
  precio?: number;
  stock?: number;
  autor_id?: number;
}
