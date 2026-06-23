import { Component, inject, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  private authService = inject(AuthService);

  user = this.authService.user;
  sidebarCollapsed = signal(false);
  adminOpen = signal(true);
  movimientosOpen = signal(false);
  inventarioOpen = signal(false);

  // Permisos individuales — las rutas deben coincidir con permisos_menu.ruta en la BD
  showDashboard    = computed(() => this.authService.hasPermiso('/dashboard'));
  showUsuarios     = computed(() => this.authService.hasPermiso('/administracion/usuarios'));
  showRoles        = computed(() => this.authService.hasPermiso('/administracion/roles'));
  showAmbitos      = computed(() => this.authService.hasPermiso('/administracion/ambitos'));
  showEstados          = computed(() => this.authService.hasPermiso('/administracion/estados'));
  showTipoMovimientos  = computed(() => this.authService.hasPermiso('/administracion/tipoMovimientos'));
  showClientes         = computed(() => this.authService.hasPermiso('/administracion/clientes'));
  showProveedores      = computed(() => this.authService.hasPermiso('/administracion/proveedores'));
  showEventos          = computed(() => this.authService.hasPermiso('/administracion/eventos'));
  showMetodosPago      = computed(() => this.authService.hasPermiso('/administracion/metodosPago'));
  showEntradas     = computed(() => this.authService.hasPermiso('/movimientos/entradas'));
  showSalidas      = computed(() => this.authService.hasPermiso('/movimientos/salidas'));
  showConsulta     = computed(() => this.authService.hasPermiso('/movimientos/consulta'));
  showAutores      = computed(() => this.authService.hasPermiso('/inventario/autores'));
  showLibros       = computed(() => this.authService.hasPermiso('/inventario/libros'));

  // Visibilidad de secciones completas
  showAdminSection = computed(() =>
    this.showUsuarios() || this.showRoles() || this.showAmbitos() || this.showEstados() ||
    this.showTipoMovimientos() || this.showClientes() || this.showProveedores() || this.showEventos() ||
    this.showMetodosPago()
  );
  showMovimientosSection = computed(() =>
    this.showEntradas() || this.showSalidas() || this.showConsulta()
  );
  showInventarioSection = computed(() =>
    this.showAutores() || this.showLibros()
  );

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
    if (this.sidebarCollapsed()) {
      this.adminOpen.set(false);
      this.movimientosOpen.set(false);
      this.inventarioOpen.set(false);
    }
  }

  toggleMovimientos(): void {
    if (this.sidebarCollapsed()) {
      this.sidebarCollapsed.set(false);
      this.movimientosOpen.set(true);
      return;
    }
    this.movimientosOpen.update((v) => !v);
  }

  toggleAdmin(): void {
    if (this.sidebarCollapsed()) {
      this.sidebarCollapsed.set(false);
      this.adminOpen.set(true);
      return;
    }
    this.adminOpen.update((v) => !v);
  }

  toggleInventario(): void {
    if (this.sidebarCollapsed()) {
      this.sidebarCollapsed.set(false);
      this.inventarioOpen.set(true);
      return;
    }
    this.inventarioOpen.update((v) => !v);
  }

  logout(): void {
    this.authService.logout();
  }
}
