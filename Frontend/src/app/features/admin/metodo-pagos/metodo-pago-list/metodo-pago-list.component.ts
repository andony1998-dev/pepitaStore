import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MetodoPagoService } from '../../../../core/services/metodo-pago.service';
import { MetodoPago } from '../../../../core/models/metodo-pago.model';
import { HelpButtonComponent } from '../../../../shared/components/help-button/help-button.component';

@Component({
  selector: 'app-metodo-pago-list',
  standalone: true,
  imports: [RouterLink, HelpButtonComponent],
  templateUrl: './metodo-pago-list.component.html',
  styleUrl: './metodo-pago-list.component.css',
})
export class MetodoPagoListComponent implements OnInit {
  private metodoPagoService = inject(MetodoPagoService);

  metodosPago = signal<MetodoPago[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  togglingId = signal<number | null>(null);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.metodoPagoService.getMetodosPago().subscribe({
      next: (data) => {
        this.metodosPago.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar los métodos de pago');
        this.isLoading.set(false);
      },
    });
  }

  toggleActivo(mp: MetodoPago): void {
    this.togglingId.set(mp.id);
    this.metodoPagoService.updateMetodoPago(mp.id, { activo: !mp.activo }).subscribe({
      next: (updated) => {
        this.metodosPago.update((list) =>
          list.map((m) => (m.id === updated.id ? updated : m))
        );
        this.togglingId.set(null);
      },
      error: () => {
        this.togglingId.set(null);
      },
    });
  }
}
