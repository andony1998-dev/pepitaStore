import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { RoleService } from '../../../../core/services/role.service';
import { Permiso } from '../../../../core/models/user.model';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.css',
})
export class RoleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private roleService = inject(RoleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = signal(false);
  roleId = signal<number | null>(null);
  permisos = signal<Permiso[]>([]);
  selectedPermisoIds = signal<Set<number>>(new Set());
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.loadPermisos();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.roleId.set(+id);
      this.loadRole(+id);
    }
  }

  private loadPermisos(): void {
    this.roleService.getPermisos().subscribe({
      next: (data) => this.permisos.set(data),
    });
  }

  private loadRole(id: number): void {
    this.isLoading.set(true);
    this.roleService.getRole(id).subscribe({
      next: (rol) => {
        this.form.patchValue({ nombre: rol.nombre });
        const ids = new Set((rol.permisos ?? []).map((p) => p.id));
        this.selectedPermisoIds.set(ids);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar el rol');
        this.isLoading.set(false);
      },
    });
  }

  togglePermiso(id: number): void {
    const current = new Set(this.selectedPermisoIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedPermisoIds.set(current);
  }

  isPermisoSelected(id: number): boolean {
    return this.selectedPermisoIds().has(id);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSaving()) return;

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const permiso_ids = Array.from(this.selectedPermisoIds());

    if (this.isEdit()) {
      const data: Record<string, unknown> = { permiso_ids };
      if (this.f['nombre'].dirty) data['nombre'] = this.f['nombre'].value;

      this.roleService.updateRole(this.roleId()!, data).subscribe({
        next: () => {
          this.successMessage.set('Rol actualizado correctamente');
          this.isSaving.set(false);
          setTimeout(() => this.router.navigate(['/admin/roles']), 1200);
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.resolveError(err));
        },
      });
    } else {
      this.roleService
        .createRole({ nombre: this.f['nombre'].value, permiso_ids })
        .subscribe({
          next: () => {
            this.successMessage.set('Rol creado correctamente');
            this.isSaving.set(false);
            setTimeout(() => this.router.navigate(['/admin/roles']), 1200);
          },
          error: (err: HttpErrorResponse) => {
            this.isSaving.set(false);
            this.errorMessage.set(this.resolveError(err));
          },
        });
    }
  }

  private resolveError(err: HttpErrorResponse): string {
    if (err.status === 409) return err.error?.message || 'Ya existe un rol con ese nombre';
    const msg = err.error?.message;
    if (msg) return Array.isArray(msg) ? msg.join(', ') : String(msg);
    return 'Ocurrió un error inesperado';
  }
}
