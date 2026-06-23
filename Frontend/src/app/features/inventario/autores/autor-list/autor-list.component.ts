import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AutorService } from '../../../../core/services/autor.service';
import { Autor } from '../../../../core/models/autor.model';
import { HelpButtonComponent } from '../../../../shared/components/help-button/help-button.component';

@Component({
  selector: 'app-autor-list',
  standalone: true,
  imports: [RouterLink, HelpButtonComponent],
  templateUrl: './autor-list.component.html',
  styleUrl: './autor-list.component.css',
})
export class AutorListComponent implements OnInit {
  private autorService = inject(AutorService);

  autores = signal<Autor[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAutores();
  }

  loadAutores(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.autorService.getAutores().subscribe({
      next: (data) => {
        this.autores.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar los autores');
        this.isLoading.set(false);
      },
    });
  }
}
