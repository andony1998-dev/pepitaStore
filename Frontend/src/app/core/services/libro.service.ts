import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Libro,
  CreateLibroRequest,
  UpdateLibroRequest,
} from '../models/libro.model';

@Injectable({ providedIn: 'root' })
export class LibroService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.api}/libros`);
  }

  getLibro(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.api}/libros/${id}`);
  }

  createLibro(data: CreateLibroRequest): Observable<Libro> {
    return this.http.post<Libro>(`${this.api}/libros`, data);
  }

  updateLibro(id: number, data: UpdateLibroRequest): Observable<Libro> {
    return this.http.patch<Libro>(`${this.api}/libros/${id}`, data);
  }
}
