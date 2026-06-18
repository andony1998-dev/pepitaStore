import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly currentYear = new Date().getFullYear();

  isLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get username() {
    return this.form.get('username')!;
  }

  get password() {
    return this.form.get('password')!;
  }

  private resolveErrorMessage(err: HttpErrorResponse): string {
    // Sin conexión o el servidor no está corriendo
    if (err.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión o intenta más tarde.';
    }
    // Credenciales inválidas
    if (err.status === 401) {
      return 'Usuario o contraseña incorrectos. Verifica tus datos e intenta de nuevo.';
    }
    // Servidor con error interno
    if (err.status === 500) {
      return 'Error interno del servidor. Por favor, intenta más tarde.';
    }
    // Mensaje del backend (puede ser string o array)
    const msg = err.error?.message;
    if (msg) {
      return Array.isArray(msg) ? msg.join(', ') : String(msg);
    }
    return 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.resolveErrorMessage(err));
      },
    });
  }
}
