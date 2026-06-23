import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { EventoService } from '../../../../core/services/evento.service';
import { HelpButtonComponent } from '../../../../shared/components/help-button/help-button.component';

@Component({
  selector: 'app-evento-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, HelpButtonComponent],
  templateUrl: './evento-form.component.html',
  styleUrl: './evento-form.component.css',
})
export class EventoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private eventoService = inject(EventoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = signal(false);
  eventoId = signal<number | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    activo: [true],
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.eventoId.set(+id);
      this.loadEvento(+id);
    }
  }

  private loadEvento(id: number): void {
    this.isLoading.set(true);
    this.eventoService.getEvento(id).subscribe({
      next: (evento) => {
        this.form.patchValue({
          nombre: evento.nombre,
          activo: evento.activo,
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar el evento');
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
      if (this.f['nombre'].dirty) data['nombre'] = raw.nombre;
      if (this.f['activo'].dirty) data['activo'] = raw.activo;

      this.eventoService.updateEvento(this.eventoId()!, data).subscribe({
        next: () => {
          this.successMessage.set('Evento actualizado correctamente');
          this.isSaving.set(false);
          setTimeout(() => this.router.navigate(['/admin/eventos']), 1200);
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.resolveError(err));
        },
      });
    } else {
      data['nombre'] = raw.nombre;
      data['activo'] = raw.activo;

      this.eventoService.createEvento(data as any).subscribe({
        next: () => {
          this.successMessage.set('Evento creado correctamente');
          this.isSaving.set(false);
          setTimeout(() => this.router.navigate(['/admin/eventos']), 1200);
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
