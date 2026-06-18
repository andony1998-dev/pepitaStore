import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { TipoMovimientoService } from '../../../../core/services/tipo-movimiento.service';

@Component({
  selector: 'app-tipo-movimiento-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './tipo-movimiento-form.component.html',
  styleUrl: './tipo-movimiento-form.component.css',
})
export class TipoMovimientoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private tipoMovimientoService = inject(TipoMovimientoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = signal(false);
  tipoId = signal<number | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    activo: [true],
    operacion: [null, [Validators.required]],
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.tipoId.set(+id);
      this.loadTipo(+id);
    }
  }

  private loadTipo(id: number): void {
    this.isLoading.set(true);
    this.tipoMovimientoService.getTipoMovimiento(id).subscribe({
      next: (tipo) => {
        this.form.patchValue({
          descripcion: tipo.descripcion,
          activo: tipo.activo,
          operacion: tipo.operacion,
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar el tipo de movimiento');
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

    const raw = this.form.value;
    const data: Record<string, unknown> = {};

    if (this.isEdit()) {
      if (this.f['descripcion'].dirty) data['descripcion'] = raw.descripcion;
      if (this.f['activo'].dirty) data['activo'] = raw.activo;
      if (this.f['operacion'].dirty) data['operacion'] = Number(raw.operacion);

      this.tipoMovimientoService.updateTipoMovimiento(this.tipoId()!, data).subscribe({
        next: () => {
          this.successMessage.set('Tipo de movimiento actualizado correctamente');
          this.isSaving.set(false);
          setTimeout(() => this.router.navigate(['/admin/tipo-movimientos']), 1200);
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.resolveError(err));
        },
      });
    } else {
      data['descripcion'] = raw.descripcion;
      data['activo'] = raw.activo;
      data['operacion'] = Number(raw.operacion);

      this.tipoMovimientoService.createTipoMovimiento(data as any).subscribe({
        next: () => {
          this.successMessage.set('Tipo de movimiento creado correctamente');
          this.isSaving.set(false);
          setTimeout(() => this.router.navigate(['/admin/tipo-movimientos']), 1200);
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.resolveError(err));
        },
      });
    }
  }

  private resolveError(err: HttpErrorResponse): string {
    const msg = err.error?.message;
    if (msg) return Array.isArray(msg) ? msg.join(', ') : String(msg);
    return 'Ocurrió un error inesperado';
  }
}
