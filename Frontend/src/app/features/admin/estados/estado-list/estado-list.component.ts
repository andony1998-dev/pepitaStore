import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoService } from '../../../../core/services/estado.service';
import { Estado } from '../../../../core/models/estado.model';
import { HelpButtonComponent } from '../../../../shared/components/help-button/help-button.component';

@Component({
  selector: 'app-estado-list',
  standalone: true,
  imports: [RouterLink, HelpButtonComponent],
  templateUrl: './estado-list.component.html',
  styleUrl: './estado-list.component.css',
})
export class EstadoListComponent implements OnInit {
  private estadoService = inject(EstadoService);

  estados = signal<Estado[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadEstados();
  }

  loadEstados(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.estadoService.getEstados().subscribe({
      next: (data) => {
        this.estados.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar los estados');
        this.isLoading.set(false);
      },
    });
  }
}
