import { Routes } from '@angular/router';
import { authGuard, publicGuard, permisoGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  // Rutas protegidas con layout (sidebar + topbar)
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),
    children: [
      {
        path: 'dashboard',
        canActivate: [permisoGuard],
        data: { permiso: '/dashboard' },
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      // Administración - Usuarios
      {
        path: 'admin/users',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/usuarios' },
        loadComponent: () =>
          import('./features/admin/users/user-list/user-list.component').then(
            (m) => m.UserListComponent
          ),
      },
      {
        path: 'admin/users/new',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/usuarios' },
        loadComponent: () =>
          import('./features/admin/users/user-form/user-form.component').then(
            (m) => m.UserFormComponent
          ),
      },
      {
        path: 'admin/users/:id/edit',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/usuarios' },
        loadComponent: () =>
          import('./features/admin/users/user-form/user-form.component').then(
            (m) => m.UserFormComponent
          ),
      },
      // Administración - Roles
      {
        path: 'admin/roles',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/roles' },
        loadComponent: () =>
          import('./features/admin/roles/role-list/role-list.component').then(
            (m) => m.RoleListComponent
          ),
      },
      {
        path: 'admin/roles/new',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/roles' },
        loadComponent: () =>
          import('./features/admin/roles/role-form/role-form.component').then(
            (m) => m.RoleFormComponent
          ),
      },
      {
        path: 'admin/roles/:id/edit',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/roles' },
        loadComponent: () =>
          import('./features/admin/roles/role-form/role-form.component').then(
            (m) => m.RoleFormComponent
          ),
      },
      // Administración - Ámbitos
      {
        path: 'admin/ambitos',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/ambitos' },
        loadComponent: () =>
          import('./features/admin/ambitos/ambito-list/ambito-list.component').then(
            (m) => m.AmbitoListComponent
          ),
      },
      {
        path: 'admin/ambitos/new',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/ambitos' },
        loadComponent: () =>
          import('./features/admin/ambitos/ambito-form/ambito-form.component').then(
            (m) => m.AmbitoFormComponent
          ),
      },
      {
        path: 'admin/ambitos/:id/edit',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/ambitos' },
        loadComponent: () =>
          import('./features/admin/ambitos/ambito-form/ambito-form.component').then(
            (m) => m.AmbitoFormComponent
          ),
      },
      // Administración - Estados
      {
        path: 'admin/estados',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/estados' },
        loadComponent: () =>
          import('./features/admin/estados/estado-list/estado-list.component').then(
            (m) => m.EstadoListComponent
          ),
      },
      {
        path: 'admin/estados/new',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/estados' },
        loadComponent: () =>
          import('./features/admin/estados/estado-form/estado-form.component').then(
            (m) => m.EstadoFormComponent
          ),
      },
      {
        path: 'admin/estados/:id/edit',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/estados' },
        loadComponent: () =>
          import('./features/admin/estados/estado-form/estado-form.component').then(
            (m) => m.EstadoFormComponent
          ),
      },
      // Administración - Tipo de Movimientos
      {
        path: 'admin/tipo-movimientos',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/tipoMovimientos' },
        loadComponent: () =>
          import('./features/admin/tipo-movimientos/tipo-movimiento-list/tipo-movimiento-list.component').then(
            (m) => m.TipoMovimientoListComponent
          ),
      },
      {
        path: 'admin/tipo-movimientos/new',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/tipoMovimientos' },
        loadComponent: () =>
          import('./features/admin/tipo-movimientos/tipo-movimiento-form/tipo-movimiento-form.component').then(
            (m) => m.TipoMovimientoFormComponent
          ),
      },
      {
        path: 'admin/tipo-movimientos/:id/edit',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/tipoMovimientos' },
        loadComponent: () =>
          import('./features/admin/tipo-movimientos/tipo-movimiento-form/tipo-movimiento-form.component').then(
            (m) => m.TipoMovimientoFormComponent
          ),
      },
      // Administración - Clientes
      {
        path: 'admin/clientes',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/clientes' },
        loadComponent: () =>
          import('./features/admin/clientes/cliente-list/cliente-list.component').then(
            (m) => m.ClienteListComponent
          ),
      },
      {
        path: 'admin/clientes/new',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/clientes' },
        loadComponent: () =>
          import('./features/admin/clientes/cliente-form/cliente-form.component').then(
            (m) => m.ClienteFormComponent
          ),
      },
      {
        path: 'admin/clientes/:id/edit',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/clientes' },
        loadComponent: () =>
          import('./features/admin/clientes/cliente-form/cliente-form.component').then(
            (m) => m.ClienteFormComponent
          ),
      },
      // Administración - Proveedores
      {
        path: 'admin/proveedores',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/proveedores' },
        loadComponent: () =>
          import('./features/admin/proveedores/proveedor-list/proveedor-list.component').then(
            (m) => m.ProveedorListComponent
          ),
      },
      {
        path: 'admin/proveedores/new',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/proveedores' },
        loadComponent: () =>
          import('./features/admin/proveedores/proveedor-form/proveedor-form.component').then(
            (m) => m.ProveedorFormComponent
          ),
      },
      {
        path: 'admin/proveedores/:id/edit',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/proveedores' },
        loadComponent: () =>
          import('./features/admin/proveedores/proveedor-form/proveedor-form.component').then(
            (m) => m.ProveedorFormComponent
          ),
      },
      // Administración - Eventos
      {
        path: 'admin/eventos',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/eventos' },
        loadComponent: () =>
          import('./features/admin/eventos/evento-list/evento-list.component').then(
            (m) => m.EventoListComponent
          ),
      },
      {
        path: 'admin/eventos/new',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/eventos' },
        loadComponent: () =>
          import('./features/admin/eventos/evento-form/evento-form.component').then(
            (m) => m.EventoFormComponent
          ),
      },
      {
        path: 'admin/eventos/:id/edit',
        canActivate: [permisoGuard],
        data: { permiso: '/administracion/eventos' },
        loadComponent: () =>
          import('./features/admin/eventos/evento-form/evento-form.component').then(
            (m) => m.EventoFormComponent
          ),
      },
      // Movimientos - Entradas
      {
        path: 'movimientos/entradas',
        canActivate: [permisoGuard],
        data: { permiso: '/movimientos/entradas', operacion: 1 },
        loadComponent: () =>
          import('./features/movimientos/movimiento-form/movimiento-form.component').then(
            (m) => m.MovimientoFormComponent
          ),
      },
      // Movimientos - Salidas
      {
        path: 'movimientos/salidas',
        canActivate: [permisoGuard],
        data: { permiso: '/movimientos/salidas', operacion: -1 },
        loadComponent: () =>
          import('./features/movimientos/movimiento-form/movimiento-form.component').then(
            (m) => m.MovimientoFormComponent
          ),
      },
      // Movimientos - Consulta
      {
        path: 'movimientos/consulta',
        canActivate: [permisoGuard],
        data: { permiso: '/movimientos/consulta' },
        loadComponent: () =>
          import('./features/movimientos/consulta/consulta.component').then(
            (m) => m.ConsultaComponent
          ),
      },
      // Inventario - Autores
      {
        path: 'inventario/autores',
        canActivate: [permisoGuard],
        data: { permiso: '/inventario/autores' },
        loadComponent: () =>
          import('./features/inventario/autores/autor-list/autor-list.component').then(
            (m) => m.AutorListComponent
          ),
      },
      {
        path: 'inventario/autores/new',
        canActivate: [permisoGuard],
        data: { permiso: '/inventario/autores' },
        loadComponent: () =>
          import('./features/inventario/autores/autor-form/autor-form.component').then(
            (m) => m.AutorFormComponent
          ),
      },
      {
        path: 'inventario/autores/:id/edit',
        canActivate: [permisoGuard],
        data: { permiso: '/inventario/autores' },
        loadComponent: () =>
          import('./features/inventario/autores/autor-form/autor-form.component').then(
            (m) => m.AutorFormComponent
          ),
      },
      // Inventario - Libros
      {
        path: 'inventario/libros',
        canActivate: [permisoGuard],
        data: { permiso: '/inventario/libros' },
        loadComponent: () =>
          import('./features/inventario/libros/libro-list/libro-list.component').then(
            (m) => m.LibroListComponent
          ),
      },
      {
        path: 'inventario/libros/new',
        canActivate: [permisoGuard],
        data: { permiso: '/inventario/libros' },
        loadComponent: () =>
          import('./features/inventario/libros/libro-form/libro-form.component').then(
            (m) => m.LibroFormComponent
          ),
      },
      {
        path: 'inventario/libros/:id/edit',
        canActivate: [permisoGuard],
        data: { permiso: '/inventario/libros' },
        loadComponent: () =>
          import('./features/inventario/libros/libro-form/libro-form.component').then(
            (m) => m.LibroFormComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
