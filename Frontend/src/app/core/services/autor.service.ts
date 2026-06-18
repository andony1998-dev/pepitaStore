import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Autor,
  CreateAutorRequest,
  UpdateAutorRequest,
} from '../models/autor.model';

@Injectable({ providedIn: 'root' })
export class AutorService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getAutores(): Observable<Autor[]> {
    return this.http.get<Autor[]>(`${this.api}/autores`);
  }

  getAutor(id: number): Observable<Autor> {
    return this.http.get<Autor>(`${this.api}/autores/${id}`);
  }

  createAutor(data: CreateAutorRequest): Observable<Autor> {
    return this.http.post<Autor>(`${this.api}/autores`, data);
  }

  updateAutor(id: number, data: UpdateAutorRequest): Observable<Autor> {
    return this.http.patch<Autor>(`${this.api}/autores/${id}`, data);
  }
}
