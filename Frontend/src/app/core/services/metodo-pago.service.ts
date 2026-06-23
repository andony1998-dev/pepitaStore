import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MetodoPago, CreateMetodoPagoRequest, UpdateMetodoPagoRequest } from '../models/metodo-pago.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MetodoPagoService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/metodo-pago`;

  getMetodosPago(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(this.base);
  }

  getMetodoPago(id: number): Observable<MetodoPago> {
    return this.http.get<MetodoPago>(`${this.base}/${id}`);
  }

  createMetodoPago(data: CreateMetodoPagoRequest): Observable<MetodoPago> {
    return this.http.post<MetodoPago>(this.base, data);
  }

  updateMetodoPago(id: number, data: UpdateMetodoPagoRequest): Observable<MetodoPago> {
    return this.http.patch<MetodoPago>(`${this.base}/${id}`, data);
  }
}
