import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { LibroService } from '../../../../core/services/libro.service';
import { Libro } from '../../../../core/models/libro.model';
import { HelpButtonComponent } from '../../../../shared/components/help-button/help-button.component';

@Component({
  selector: 'app-libro-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, HelpButtonComponent],
  templateUrl: './libro-list.component.html',
  styleUrl: './libro-list.component.css',
})
export class LibroListComponent implements OnInit {
  private libroService = inject(LibroService);

  libros = signal<Libro[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadLibros();
  }

  loadLibros(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.libroService.getLibros().subscribe({
      next: (data) => {
        this.libros.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar los libros');
        this.isLoading.set(false);
      },
    });
  }
}
