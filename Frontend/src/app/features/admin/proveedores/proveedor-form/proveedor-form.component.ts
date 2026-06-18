import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProveedorService } from '../../../../core/services/proveedor.service';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './proveedor-form.component.html',
  styleUrl: './proveedor-form.component.css',
})
export class ProveedorFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private proveedorService = inject(ProveedorService);

  isEdit = signal(false);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form = this.fb.group({
    nombreProveedor: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
    direccion:       [''],
    telefono:        ['', [Validators.maxLength(20)]],
    telefono2:       ['', [Validators.maxLength(20)]],
    email:           ['', [Validators.email, Validators.maxLength(100)]],
    activo:          [true],
  });

  get f() { return this.form.controls; }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.loadProveedor(+id);
    }
  }

  private loadProveedor(id: number): void {
    this.isLoading.set(true);
    this.proveedorService.getProveedor(id).subscribe({
      next: (proveedor) => {
        this.form.patchValue({
          nombreProveedor: proveedor.nombreProveedor,
          direccion:       proveedor.direccion ?? '',
          telefono:        proveedor.telefono ?? '',
          telefono2:       proveedor.telefono2 ?? '',
          email:           proveedor.email ?? '',
          activo:          proveedor.activo,
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar el proveedor');
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
      nombreProveedor: raw.nombreProveedor!,
      direccion:       raw.direccion || undefined,
      telefono:        raw.telefono || undefined,
      telefono2:       raw.telefono2 || undefined,
      email:           raw.email || undefined,
      activo:          raw.activo!,
    };

    const id = this.route.snapshot.paramMap.get('id');
    const request = id
      ? this.proveedorService.updateProveedor(+id, payload)
      : this.proveedorService.createProveedor(payload);

    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set(id ? 'Proveedor actualizado correctamente' : 'Proveedor creado correctamente');
        setTimeout(() => this.router.navigate(['/admin/proveedores']), 1200);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Error al guardar el proveedor');
      },
    });
  }
}
