export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  rol: string | null;
  permisos: string[];
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}
