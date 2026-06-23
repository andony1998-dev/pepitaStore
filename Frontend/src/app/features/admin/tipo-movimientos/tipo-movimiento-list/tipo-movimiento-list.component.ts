import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TipoMovimientoService } from '../../../../core/services/tipo-movimiento.service';
import { TipoMovimiento } from '../../../../core/models/tipo-movimiento.model';
import { HelpButtonComponent } from '../../../../shared/components/help-button/help-button.component';

@Component({
  selector: 'app-tipo-movimiento-list',
  standalone: true,
  imports: [RouterLink, HelpButtonComponent],
  templateUrl: './tipo-movimiento-list.component.html',
  styleUrl: './tipo-movimiento-list.component.css',
})
export class TipoMovimientoListComponent implements OnInit {
  private tipoMovimientoService = inject(TipoMovimientoService);

  tipoMovimientos = signal<TipoMovimiento[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  togglingId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadTipoMovimientos();
  }

  loadTipoMovimientos(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.tipoMovimientoService.getTipoMovimientos().subscribe({
      next: (data) => {
        this.tipoMovimientos.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar los tipos de movimiento');
        this.isLoading.set(false);
      },
    });
  }

  toggleActivo(tipo: TipoMovimiento): void {
    this.togglingId.set(tipo.id);
    this.tipoMovimientoService.updateTipoMovimiento(tipo.id, { activo: !tipo.activo }).subscribe({
      next: (updated) => {
        this.tipoMovimientos.update((list) =>
          list.map((t) => (t.id === updated.id ? updated : t))
        );
        this.togglingId.set(null);
      },
      error: () => {
        this.togglingId.set(null);
      },
    });
  }
}
