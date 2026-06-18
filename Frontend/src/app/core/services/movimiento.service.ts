import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movimiento, CreateMovimientoRequest } from '../models/movimiento.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/movimientos`;

  getMovimientos(operacion?: 1 | -1): Observable<Movimiento[]> {
    let params = new HttpParams();
    if (operacion !== undefined) params = params.set('operacion', String(operacion));
    return this.http.get<Movimiento[]>(this.base, { params });
  }

  getMovimiento(id: number): Observable<Movimiento> {
    return this.http.get<Movimiento>(`${this.base}/${id}`);
  }

  createMovimiento(data: CreateMovimientoRequest): Observable<Movimiento> {
    return this.http.post<Movimiento>(this.base, data);
  }
}
