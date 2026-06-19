import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { MovimientoService } from '../../../core/services/movimiento.service';
import { TipoMovimientoService } from '../../../core/services/tipo-movimiento.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { ProveedorService } from '../../../core/services/proveedor.service';
import { EstadoService } from '../../../core/services/estado.service';
import { EventoService } from '../../../core/services/evento.service';
import { LibroService } from '../../../core/services/libro.service';
import { TipoMovimiento } from '../../../core/models/tipo-movimiento.model';
import { Cliente } from '../../../core/models/cliente.model';
import { Proveedor } from '../../../core/models/proveedor.model';
import { Estado } from '../../../core/models/estado.model';
import { Evento } from '../../../core/models/evento.model';
import { Libro } from '../../../core/models/libro.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe],
  templateUrl: './movimiento-form.component.html',
  styleUrl: './movimiento-form.component.css',
})
export class MovimientoFormComponent implements OnInit {
  private fb         = inject(FormBuilder);
  private route      = inject(ActivatedRoute);
  private router     = inject(Router);
  private movService = inject(MovimientoService);
  private tipoService   = inject(TipoMovimientoService);
  private clienteService   = inject(ClienteService);
  private proveedorService = inject(ProveedorService);
  private estadoService    = inject(EstadoService);
  private eventoService    = inject(EventoService);
  private libroService     = inject(LibroService);

  // operacion: 1 = Entrada, -1 = Salida (viene de route.data)
  operacion = signal<1 | -1>(1);
  isEntrada = computed(() => this.operacion() === 1);

  isLoading = signal(true);
  isSaving  = signal(false);
  errorMessage   = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  tipoMovimientos = signal<TipoMovimiento[]>([]);
  clientes        = signal<Cliente[]>([]);
  proveedores     = signal<Proveedor[]>([]);
  estados         = signal<Estado[]>([]);
  eventos         = signal<Evento[]>([]);
  libros          = signal<Libro[]>([]);

  form = this.fb.group({
    tipoMovimientoId: [null as number | null, Validators.required],
    fecha:            [this.hoy()],
    clienteId:        [null as number | null],
    proveedorId:      [null as number | null],
    estadoId:         [null as number | null, Validators.required],
    eventoId:         [null as number | null],
    detalles: this.fb.array([this.crearDetalleGroup()]),
  });

  get f() { return this.form.controls; }
  get detallesArray(): FormArray { return this.form.get('detalles') as FormArray; }
  detalleAt(i: number): AbstractControl { return this.detallesArray.at(i); }

  ngOnInit(): void {
    const op = this.route.snapshot.data['operacion'] as 1 | -1;
    this.operacion.set(op ?? 1);

    forkJoin({
      tipos:      this.tipoService.getTipoMovimientos(),
      clientes:   this.clienteService.getClientes(),
      proveedores: this.proveedorService.getProveedores(),
      estados:    this.estadoService.getEstados(),
      eventos:    this.eventoService.getEventos(),
      libros:     this.libroService.getLibros(),
    }).subscribe({
      next: ({ tipos, clientes, proveedores, estados, eventos, libros }) => {
        this.tipoMovimientos.set(tipos.filter(t => t.operacion === this.operacion() && t.activo));
        this.clientes.set(clientes.filter(c => c.activo));
        this.proveedores.set(proveedores.filter(p => p.activo));
        this.estados.set(estados);
        this.eventos.set(eventos.filter(e => e.activo));
        this.libros.set(libros);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar los datos del formulario');
        this.isLoading.set(false);
      },
    });
  }

  private hoy(): string {
    return new Date().toISOString().slice(0, 16);
  }

  crearDetalleGroup() {
    const g = this.fb.group({
      libroId:             [null as number | null, Validators.required],
      cantidad:            [1, [Validators.required, Validators.min(1)]],
      precioUnitario:      [0, [Validators.required, Validators.min(0)]],
      porcentajeDescuento: [0, [Validators.min(0), Validators.max(100)]],
      precioFinal:         [{ value: 0, disabled: true }],
    });
    g.valueChanges.subscribe(() => this.calcularFinal(g));
    return g;
  }

  private calcularFinal(g: ReturnType<typeof this.crearDetalleGroup>): void {
    const cant = Number(g.get('cantidad')?.value ?? 0);
    const precio = Number(g.get('precioUnitario')?.value ?? 0);
    const desc = Number(g.get('porcentajeDescuento')?.value ?? 0);
    const final = cant * precio * (1 - desc / 100);
    g.get('precioFinal')?.setValue(Math.round(final * 100) / 100, { emitEvent: false });
  }

  agregarDetalle(): void {
    this.detallesArray.push(this.crearDetalleGroup());
  }

  eliminarDetalle(i: number): void {
    if (this.detallesArray.length > 1) this.detallesArray.removeAt(i);
  }

  libroLabel(libroId: number | null): string {
    if (!libroId) return '';
    const libro = this.libros().find(l => l.id === Number(libroId));
    return libro ? `${libro.titulo} (${libro.isbn})` : '';
  }

  onLibroChange(i: number): void {
    const g = this.detallesArray.at(i);
    const libroId = Number(g.get('libroId')?.value);
    const libro = this.libros().find(l => l.id === libroId);
    if (libro) {
      g.patchValue({ precioUnitario: libro.precio });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    const raw = this.form.getRawValue();
    const payload = {
      tipoMovimientoId: Number(raw.tipoMovimientoId),
      fecha:            raw.fecha ? new Date(raw.fecha).toISOString() : undefined,
      clienteId:        raw.clienteId ? Number(raw.clienteId) : undefined,
      proveedorId:      raw.proveedorId ? Number(raw.proveedorId) : undefined,
      estadoId:         Number(raw.estadoId),
      eventoId:         raw.eventoId ? Number(raw.eventoId) : undefined,
      detalles: raw.detalles.map(d => ({
        libroId:             Number(d.libroId),
        cantidad:            Number(d.cantidad),
        precioUnitario:      Number(d.precioUnitario),
        porcentajeDescuento: Number(d.porcentajeDescuento ?? 0),
        precioFinal:         Number(d.precioFinal),
      })),
    };

    this.movService.createMovimiento(payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set('Movimiento registrado correctamente');
        setTimeout(() => this.router.navigate(['/movimientos/consulta']), 1200);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Error al registrar el movimiento');
      },
    });
  }

  get totalGeneral(): number {
    return this.detallesArray.controls.reduce((sum, g) => {
      return sum + Number(g.get('precioFinal')?.value ?? 0);
    }, 0);
  }
}
