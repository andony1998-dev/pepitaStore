import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { UserService } from '../../../../core/services/user.service';
import { Rol } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = signal(false);
  userId = signal<number | null>(null);
  roles = signal<Rol[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rol_id: ['', [Validators.required]],
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.loadRoles();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.userId.set(+id);
      this.form.get('password')!.clearValidators();
      this.form.get('password')!.updateValueAndValidity();
      this.loadUser(+id);
    }
  }

  private loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (roles) => this.roles.set(roles),
    });
  }

  private loadUser(id: number): void {
    this.isLoading.set(true);
    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.form.patchValue({
          username: user.username,
          email: user.email,
          rol_id: user.rol_id,
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar el usuario');
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSaving()) return;

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.isEdit()) {
      const data: Record<string, unknown> = {};
      if (this.f['username'].dirty) data['username'] = this.f['username'].value;
      if (this.f['email'].dirty) data['email'] = this.f['email'].value;
      if (this.f['rol_id'].dirty) data['rol_id'] = +this.f['rol_id'].value;
      if (this.f['password'].value) data['password'] = this.f['password'].value;

      this.userService.updateUser(this.userId()!, data).subscribe({
        next: () => {
          this.successMessage.set('Usuario actualizado correctamente');
          this.isSaving.set(false);
          setTimeout(() => this.router.navigate(['/admin/users']), 1200);
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.resolveError(err));
        },
      });
    } else {
      this.userService
        .createUser({
          ...this.form.getRawValue(),
          rol_id: +this.f['rol_id'].value,
        })
        .subscribe({
          next: () => {
            this.successMessage.set('Usuario creado correctamente');
            this.isSaving.set(false);
            setTimeout(() => this.router.navigate(['/admin/users']), 1200);
          },
          error: (err: HttpErrorResponse) => {
            this.isSaving.set(false);
            this.errorMessage.set(this.resolveError(err));
          },
        });
    }
  }

  private resolveError(err: HttpErrorResponse): string {
    if (err.status === 409) return err.error?.message || 'El usuario o email ya existe';
    const msg = err.error?.message;
    if (msg) return Array.isArray(msg) ? msg.join(', ') : String(msg);
    return 'Ocurrió un error inesperado';
  }
}
