import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventoService } from '../../../../core/services/evento.service';
import { Evento } from '../../../../core/models/evento.model';
import { HelpButtonComponent } from '../../../../shared/components/help-button/help-button.component';

@Component({
  selector: 'app-evento-list',
  standalone: true,
  imports: [RouterLink, HelpButtonComponent],
  templateUrl: './evento-list.component.html',
  styleUrl: './evento-list.component.css',
})
export class EventoListComponent implements OnInit {
  private eventoService = inject(EventoService);

  eventos = signal<Evento[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  togglingId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadEventos();
  }

  loadEventos(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.eventoService.getEventos().subscribe({
      next: (data) => {
        this.eventos.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar los eventos');
        this.isLoading.set(false);
      },
    });
  }

  toggleActivo(evento: Evento): void {
    this.togglingId.set(evento.id);
    this.eventoService.updateEvento(evento.id, { activo: !evento.activo }).subscribe({
      next: (updated) => {
        this.eventos.update((list) =>
          list.map((e) => (e.id === updated.id ? updated : e))
        );
        this.togglingId.set(null);
      },
      error: () => {
        this.togglingId.set(null);
      },
    });
  }
}
