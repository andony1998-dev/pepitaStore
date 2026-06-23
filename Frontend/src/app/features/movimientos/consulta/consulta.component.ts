import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MovimientoService } from '../../../core/services/movimiento.service';
import { Movimiento } from '../../../core/models/movimiento.model';
import { HelpButtonComponent } from '../../../shared/components/help-button/help-button.component';

type Filtro = 'todos' | 'entradas' | 'salidas';

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyPipe, HelpButtonComponent],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.css',
})
export class ConsultaComponent implements OnInit {
  private movService = inject(MovimientoService);

  movimientos  = signal<Movimiento[]>([]);
  isLoading    = signal(true);
  errorMessage = signal<string | null>(null);
  filtro       = signal<Filtro>('todos');

  movimientosFiltrados = computed(() => {
    const f = this.filtro();
    const list = this.movimientos();
    if (f === 'entradas') return list.filter(m => m.tipoMovimiento?.operacion === 1);
    if (f === 'salidas')  return list.filter(m => m.tipoMovimiento?.operacion === -1);
    return list;
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.movService.getMovimientos().subscribe({
      next: (data) => {
        this.movimientos.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar los movimientos');
        this.isLoading.set(false);
      },
    });
  }

  setFiltro(f: Filtro): void {
    this.filtro.set(f);
  }

  contarLibros(m: Movimiento): number {
    return m.detalles?.reduce((sum, d) => sum + d.cantidad, 0) ?? 0;
  }

  totalMovimiento(m: Movimiento): number {
    return m.detalles?.reduce((sum, d) => sum + Number(d.precioFinal), 0) ?? 0;
  }

  contadorEntradas = computed(() =>
    this.movimientos().filter(m => m.tipoMovimiento?.operacion === 1).length
  );
  contadorSalidas = computed(() =>
    this.movimientos().filter(m => m.tipoMovimiento?.operacion === -1).length
  );

  selectedMovimiento = signal<Movimiento | null>(null);

  openDetalle(mov: Movimiento): void { this.selectedMovimiento.set(mov); }
  closeDetalle(): void { this.selectedMovimiento.set(null); }
}
