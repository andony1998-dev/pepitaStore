import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClienteService } from '../../../../core/services/cliente.service';
import { Cliente } from '../../../../core/models/cliente.model';
import { HelpButtonComponent } from '../../../../shared/components/help-button/help-button.component';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [RouterLink, HelpButtonComponent],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css',
})
export class ClienteListComponent implements OnInit {
  private clienteService = inject(ClienteService);

  clientes = signal<Cliente[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  togglingId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar los clientes');
        this.isLoading.set(false);
      },
    });
  }

  toggleActivo(cliente: Cliente): void {
    this.togglingId.set(cliente.id);
    this.clienteService.updateCliente(cliente.id, { activo: !cliente.activo }).subscribe({
      next: (updated) => {
        this.clientes.update((list) =>
          list.map((c) => (c.id === updated.id ? updated : c))
        );
        this.togglingId.set(null);
      },
      error: () => {
        this.togglingId.set(null);
      },
    });
  }
}
