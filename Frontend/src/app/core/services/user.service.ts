import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  User,
  Rol,
  CreateUserRequest,
  UpdateUserRequest,
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.api}/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/users/${id}`);
  }

  createUser(data: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.api}/users`, data);
  }

  updateUser(id: number, data: UpdateUserRequest): Observable<User> {
    return this.http.patch<User>(`${this.api}/users/${id}`, data);
  }

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.api}/roles`);
  }
}
