import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Ambito, CreateAmbitoRequest, UpdateAmbitoRequest } from '../models/ambito.model';

@Injectable({ providedIn: 'root' })
export class AmbitoService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getAmbitos(): Observable<Ambito[]> {
    return this.http.get<Ambito[]>(`${this.api}/ambitos`);
  }

  getAmbito(id: number): Observable<Ambito> {
    return this.http.get<Ambito>(`${this.api}/ambitos/${id}`);
  }

  createAmbito(data: CreateAmbitoRequest): Observable<Ambito> {
    return this.http.post<Ambito>(`${this.api}/ambitos`, data);
  }

  updateAmbito(id: number, data: UpdateAmbitoRequest): Observable<Ambito> {
    return this.http.patch<Ambito>(`${this.api}/ambitos/${id}`, data);
  }
}
