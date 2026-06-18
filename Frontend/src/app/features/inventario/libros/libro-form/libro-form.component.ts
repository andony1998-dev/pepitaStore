import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { LibroService } from '../../../../core/services/libro.service';
import { AutorService } from '../../../../core/services/autor.service';
import { Autor } from '../../../../core/models/autor.model';

@Component({
  selector: 'app-libro-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './libro-form.component.html',
  styleUrl: './libro-form.component.css',
})
export class LibroFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private libroService = inject(LibroService);
  private autorService = inject(AutorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = signal(false);
  libroId = signal<number | null>(null);
  autores = signal<Autor[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(2)]],
    isbn: ['', [Validators.required]],
    fecha_publicacion: [''],
    precio: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    autor_id: ['', [Validators.required]],
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.loadAutores();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.libroId.set(+id);
      this.loadLibro(+id);
    }
  }

  private loadAutores(): void {
    this.autorService.getAutores().subscribe({
      next: (data) => this.autores.set(data),
    });
  }

  private loadLibro(id: number): void {
    this.isLoading.set(true);
    this.libroService.getLibro(id).subscribe({
      next: (libro) => {
        this.form.patchValue({
          titulo: libro.titulo,
          isbn: libro.isbn,
          fecha_publicacion: libro.fecha_publicacion ?? '',
          precio: libro.precio,
          stock: libro.stock,
          autor_id: libro.autor_id,
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar el libro');
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSaving()) return;

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const raw = this.form.value;

    if (this.isEdit()) {
      const data: Record<string, unknown> = {};
      if (this.f['titulo'].dirty) data['titulo'] = raw.titulo;
      if (this.f['isbn'].dirty) data['isbn'] = raw.isbn;
      if (this.f['fecha_publicacion'].dirty) data['fecha_publicacion'] = raw.fecha_publicacion || null;
      if (this.f['precio'].dirty) data['precio'] = +raw.precio;
      if (this.f['stock'].dirty) data['stock'] = +raw.stock;
      if (this.f['autor_id'].dirty) data['autor_id'] = +raw.autor_id;

      this.libroService.updateLibro(this.libroId()!, data).subscribe({
        next: () => {
          this.successMessage.set('Libro actualizado correctamente');
          this.isSaving.set(false);
          setTimeout(() => this.router.navigate(['/inventario/libros']), 1200);
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.resolveError(err));
        },
      });
    } else {
      const payload = {
        titulo: raw.titulo,
        isbn: raw.isbn,
        fecha_publicacion: raw.fecha_publicacion || undefined,
        precio: +raw.precio,
        stock: +raw.stock,
        autor_id: +raw.autor_id,
      };

      this.libroService.createLibro(payload).subscribe({
        next: () => {
          this.successMessage.set('Libro creado correctamente');
          this.isSaving.set(false);
          setTimeout(() => this.router.navigate(['/inventario/libros']), 1200);
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.resolveError(err));
        },
      });
    }
  }

  private resolveError(err: HttpErrorResponse): string {
    if (err.status === 409) return err.error?.message || 'Ya existe un libro con ese ISBN';
    const msg = err.error?.message;
    if (msg) return Array.isArray(msg) ? msg.join(', ') : String(msg);
    return 'Ocurrió un error inesperado';
  }
}
