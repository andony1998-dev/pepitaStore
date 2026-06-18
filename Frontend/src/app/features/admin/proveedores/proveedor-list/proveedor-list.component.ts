import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProveedorService } from '../../../../core/services/proveedor.service';
import { Proveedor } from '../../../../core/models/proveedor.model';

@Component({
  selector: 'app-proveedor-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './proveedor-list.component.html',
  styleUrl: './proveedor-list.component.css',
})
export class ProveedorListComponent implements OnInit {
  private proveedorService = inject(ProveedorService);

  proveedores = signal<Proveedor[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  togglingId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadProveedores();
  }

  loadProveedores(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.proveedorService.getProveedores().subscribe({
      next: (data) => {
        this.proveedores.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar los proveedores');
        this.isLoading.set(false);
      },
    });
  }

  toggleActivo(proveedor: Proveedor): void {
    this.togglingId.set(proveedor.id);
    this.proveedorService.updateProveedor(proveedor.id, { activo: !proveedor.activo }).subscribe({
      next: (updated) => {
        this.proveedores.update((list) =>
          list.map((p) => (p.id === updated.id ? updated : p))
        );
        this.togglingId.set(null);
      },
      error: () => {
        this.togglingId.set(null);
      },
    });
  }
}
