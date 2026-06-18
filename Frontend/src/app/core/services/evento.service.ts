import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Evento, CreateEventoRequest, UpdateEventoRequest } from '../models/evento.model';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.api}/eventos`);
  }

  getEvento(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.api}/eventos/${id}`);
  }

  createEvento(data: CreateEventoRequest): Observable<Evento> {
    return this.http.post<Evento>(`${this.api}/eventos`, data);
  }

  updateEvento(id: number, data: UpdateEventoRequest): Observable<Evento> {
    return this.http.patch<Evento>(`${this.api}/eventos/${id}`, data);
  }
}
