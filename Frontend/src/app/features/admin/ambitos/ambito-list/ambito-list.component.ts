import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AmbitoService } from '../../../../core/services/ambito.service';
import { Ambito } from '../../../../core/models/ambito.model';

@Component({
  selector: 'app-ambito-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ambito-list.component.html',
  styleUrl: './ambito-list.component.css',
})
export class AmbitoListComponent implements OnInit {
  private ambitoService = inject(AmbitoService);

  ambitos = signal<Ambito[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  togglingId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadAmbitos();
  }

  loadAmbitos(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.ambitoService.getAmbitos().subscribe({
      next: (data) => {
        this.ambitos.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar los ámbitos');
        this.isLoading.set(false);
      },
    });
  }

  toggleActivo(ambito: Ambito): void {
    this.togglingId.set(ambito.id);
    this.ambitoService.updateAmbito(ambito.id, { activo: !ambito.activo }).subscribe({
      next: (updated) => {
        this.ambitos.update((list) =>
          list.map((a) => (a.id === updated.id ? updated : a))
        );
        this.togglingId.set(null);
      },
      error: () => {
        this.togglingId.set(null);
      },
    });
  }
}
