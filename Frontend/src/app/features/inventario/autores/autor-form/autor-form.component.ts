import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AutorService } from '../../../../core/services/autor.service';
import { HelpButtonComponent } from '../../../../shared/components/help-button/help-button.component';

@Component({
  selector: 'app-autor-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, HelpButtonComponent],
  templateUrl: './autor-form.component.html',
  styleUrl: './autor-form.component.css',
})
export class AutorFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private autorService = inject(AutorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = signal(false);
  autorId = signal<number | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    nombre_completo: ['', [Validators.required, Validators.minLength(3)]],
    fecha_nacimiento: [''],
    nacionalidad: [''],
    genero_literario: [''],
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.autorId.set(+id);
      this.loadAutor(+id);
    }
  }

  private loadAutor(id: number): void {
    this.isLoading.set(true);
    this.autorService.getAutor(id).subscribe({
      next: (autor) => {
        this.form.patchValue({
          nombre_completo: autor.nombre_completo,
          fecha_nacimiento: autor.fecha_nacimiento ?? '',
          nacionalidad: autor.nacionalidad ?? '',
          genero_literario: autor.genero_literario ?? '',
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar el autor');
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
      if (this.f['nombre_completo'].dirty) data['nombre_completo'] = raw.nombre_completo;
      if (this.f['fecha_nacimiento'].dirty) data['fecha_nacimiento'] = raw.fecha_nacimiento || null;
      if (this.f['nacionalidad'].dirty) data['nacionalidad'] = raw.nacionalidad || null;
      if (this.f['genero_literario'].dirty) data['genero_literario'] = raw.genero_literario || null;

      this.autorService.updateAutor(this.autorId()!, data).subscribe({
        next: () => {
          this.successMessage.set('Autor actualizado correctamente');
          this.isSaving.set(false);
          setTimeout(() => this.router.navigate(['/inventario/autores']), 1200);
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.resolveError(err));
        },
      });
    } else {
      data['nombre_completo'] = raw.nombre_completo;
      if (raw.fecha_nacimiento) data['fecha_nacimiento'] = raw.fecha_nacimiento;
      if (raw.nacionalidad) data['nacionalidad'] = raw.nacionalidad;
      if (raw.genero_literario) data['genero_literario'] = raw.genero_literario;

      this.autorService.createAutor(data as any).subscribe({
        next: () => {
          this.successMessage.set('Autor creado correctamente');
          this.isSaving.set(false);
          setTimeout(() => this.router.navigate(['/inventario/autores']), 1200);
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
