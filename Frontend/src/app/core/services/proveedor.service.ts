import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor, CreateProveedorRequest, UpdateProveedorRequest } from '../models/proveedor.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/proveedores`;

  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.base);
  }

  getProveedor(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.base}/${id}`);
  }

  createProveedor(data: CreateProveedorRequest): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.base, data);
  }

  updateProveedor(id: number, data: UpdateProveedorRequest): Observable<Proveedor> {
    return this.http.patch<Proveedor>(`${this.base}/${id}`, data);
  }
}
