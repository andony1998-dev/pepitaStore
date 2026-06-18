import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../../../core/services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css',
})
export class ClienteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clienteService = inject(ClienteService);

  isEdit = signal(false);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form = this.fb.group({
    nombre:    ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
    nit:       ['', [Validators.maxLength(20)]],
    direccion: [''],
    telefono:  ['', [Validators.maxLength(20)]],
    telefono2: ['', [Validators.maxLength(20)]],
    email:     ['', [Validators.email, Validators.maxLength(100)]],
    activo:    [true],
  });

  get f() { return this.form.controls; }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.loadCliente(+id);
    }
  }

  private loadCliente(id: number): void {
    this.isLoading.set(true);
    this.clienteService.getCliente(id).subscribe({
      next: (cliente) => {
        this.form.patchValue({
          nombre:    cliente.nombre,
          nit:       cliente.nit ?? '',
          direccion: cliente.direccion ?? '',
          telefono:  cliente.telefono ?? '',
          telefono2: cliente.telefono2 ?? '',
          email:     cliente.email ?? '',
          activo:    cliente.activo,
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar el cliente');
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const raw = this.form.getRawValue();
    const payload = {
      nombre:    raw.nombre!,
      nit:       raw.nit || undefined,
      direccion: raw.direccion || undefined,
      telefono:  raw.telefono || undefined,
      telefono2: raw.telefono2 || undefined,
      email:     raw.email || undefined,
      activo:    raw.activo!,
    };

    const id = this.route.snapshot.paramMap.get('id');
    const request = id
      ? this.clienteService.updateCliente(+id, payload)
      : this.clienteService.createCliente(payload);

    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set(id ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente');
        setTimeout(() => this.router.navigate(['/admin/clientes']), 1200);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Error al guardar el cliente');
      },
    });
  }
}
