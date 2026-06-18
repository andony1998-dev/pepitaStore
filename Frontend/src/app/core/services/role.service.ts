import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Rol,
  Permiso,
  CreateRolRequest,
  UpdateRolRequest,
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.api}/roles`);
  }

  getRole(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.api}/roles/${id}`);
  }

  createRole(data: CreateRolRequest): Observable<Rol> {
    return this.http.post<Rol>(`${this.api}/roles`, data);
  }

  updateRole(id: number, data: UpdateRolRequest): Observable<Rol> {
    return this.http.patch<Rol>(`${this.api}/roles/${id}`, data);
  }

  getPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(`${this.api}/permisos`);
  }
}
