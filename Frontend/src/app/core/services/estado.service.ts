import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Estado, CreateEstadoRequest, UpdateEstadoRequest } from '../models/estado.model';

@Injectable({ providedIn: 'root' })
export class EstadoService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(`${this.api}/estados`);
  }

  getEstado(id: number): Observable<Estado> {
    return this.http.get<Estado>(`${this.api}/estados/${id}`);
  }

  createEstado(data: CreateEstadoRequest): Observable<Estado> {
    return this.http.post<Estado>(`${this.api}/estados`, data);
  }

  updateEstado(id: number, data: UpdateEstadoRequest): Observable<Estado> {
    return this.http.patch<Estado>(`${this.api}/estados/${id}`, data);
  }
}
