import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, CreateClienteRequest, UpdateClienteRequest } from '../models/cliente.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/clientes`;

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.base);
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.base}/${id}`);
  }

  createCliente(data: CreateClienteRequest): Observable<Cliente> {
    return this.http.post<Cliente>(this.base, data);
  }

  updateCliente(id: number, data: UpdateClienteRequest): Observable<Cliente> {
    return this.http.patch<Cliente>(`${this.base}/${id}`, data);
  }
}
