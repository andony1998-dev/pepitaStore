import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TipoMovimiento, CreateTipoMovimientoRequest, UpdateTipoMovimientoRequest } from '../models/tipo-movimiento.model';

@Injectable({ providedIn: 'root' })
export class TipoMovimientoService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getTipoMovimientos(): Observable<TipoMovimiento[]> {
    return this.http.get<TipoMovimiento[]>(`${this.api}/tipo-movimientos`);
  }

  getTipoMovimiento(id: number): Observable<TipoMovimiento> {
    return this.http.get<TipoMovimiento>(`${this.api}/tipo-movimientos/${id}`);
  }

  createTipoMovimiento(data: CreateTipoMovimientoRequest): Observable<TipoMovimiento> {
    return this.http.post<TipoMovimiento>(`${this.api}/tipo-movimientos`, data);
  }

  updateTipoMovimiento(id: number, data: UpdateTipoMovimientoRequest): Observable<TipoMovimiento> {
    return this.http.patch<TipoMovimiento>(`${this.api}/tipo-movimientos/${id}`, data);
  }
}
