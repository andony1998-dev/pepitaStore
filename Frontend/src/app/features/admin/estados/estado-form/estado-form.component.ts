import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { EstadoService } from '../../../../core/services/estado.service';
import { AmbitoService } from '../../../../core/services/ambito.service';
import { Ambito } from '../../../../core/models/ambito.model';
import { HelpButtonComponent } from '../../../../shared/components/help-button/help-button.component';

@Component({
  selector: 'app-estado-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, HelpButtonComponent],
  templateUrl: './estado-form.component.html',
  styleUrl: './estado-form.component.css',
})
export class EstadoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private estadoService = inject(EstadoService);
  private ambitoService = inject(AmbitoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = signal(false);
  estadoId = signal<number | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  ambitos = signal<Ambito[]>([]);

  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    ambitoId: [null, [Validators.required]],
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.loadAmbitos();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.estadoId.set(+id);
      this.loadEstado(+id);
    }
  }

  private loadAmbitos(): void {
    this.ambitoService.getAmbitos().subscribe({
      next: (data) => this.ambitos.set(data.filter((a) => a.activo)),
      error: () => this.errorMessage.set('Error al cargar los ámbitos'),
    });
  }

  private loadEstado(id: number): void {
    this.isLoading.set(true);
    this.estadoService.getEstado(id).subscribe({
      next: (estado) => {
        this.form.patchValue({
          nombre: estado.nombre,
          ambitoId: estado.ambitoId,
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar el estado');
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
      if (this.f['ambitoId'].dirty) data['ambitoId'] = Number(raw.ambitoId);

      this.estadoService.updateEstado(this.estadoId()!, data).subscribe({
        next: () => {
          this.successMessage.set('Estado actualizado correctamente');
          this.isSaving.set(false);
          setTimeout(() => this.router.navigate(['/admin/estados']), 1200);
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.resolveError(err));
        },
      });
    } else {
      data['nombre'] = raw.nombre;
      data['ambitoId'] = Number(raw.ambitoId);

      this.estadoService.createEstado(data as any).subscribe({
        next: () => {
          this.successMessage.set('Estado creado correctamente');
          this.isSaving.set(false);
          setTimeout(() => this.router.navigate(['/admin/estados']), 1200);
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
