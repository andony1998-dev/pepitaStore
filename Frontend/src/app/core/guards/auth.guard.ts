import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};

export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};

// Protege rutas según el permiso declarado en route.data['permiso']
export const permisoGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const ruta: string = route.data['permiso'];

  if (authService.hasPermiso(ruta)) {
    return true;
  }

  // Redirigir a login para evitar bucle infinito si el usuario
  // no tiene ningún permiso o intenta acceder a una ruta no autorizada
  return router.createUrlTree(['/auth/login']);
};
