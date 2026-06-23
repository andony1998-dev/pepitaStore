import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { MetodoPagoService } from '../../../../core/services/metodo-pago.service';
import { HelpButtonComponent } from '../../../../shared/components/help-button/help-button.component';

@Component({
  selector: 'app-metodo-pago-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, HelpButtonComponent],
  templateUrl: './metodo-pago-form.component.html',
  styleUrl: './metodo-pago-form.component.css',
})
export class MetodoPagoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private metodoPagoService = inject(MetodoPagoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = signal(false);
  metodoPagoId = signal<number | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    activo: [true],
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.metodoPagoId.set(+id);
      this.loadMetodoPago(+id);
    }
  }

  private loadMetodoPago(id: number): void {
    this.isLoading.set(true);
    this.metodoPagoService.getMetodoPago(id).subscribe({
      next: (mp) => {
        this.form.patchValue({
          descripcion: mp.descripcion,
          activo: mp.activo,
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar el método de pago');
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

      this.metodoPagoService.updateMetodoPago(this.metodoPagoId()!, data).subscribe({
        next: () => {
          this.successMessage.set('Método de pago actualizado correctamente');
          this.isSaving.set(false);
          setTimeout(() => this.router.navigate(['/admin/metodo-pagos']), 1200);
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.resolveError(err));
        },
      });
    } else {
      data['descripcion'] = raw.descripcion;
      data['activo'] = raw.activo;

      this.metodoPagoService.createMetodoPago(data as any).subscribe({
        next: () => {
          this.successMessage.set('Método de pago creado correctamente');
          this.isSaving.set(false);
          setTimeout(() => this.router.navigate(['/admin/metodo-pagos']), 1200);
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
