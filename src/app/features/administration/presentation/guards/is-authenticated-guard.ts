import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { lastValueFrom, tap } from 'rxjs';
import { AuthData } from '../../datasources/auth-data';
import { environment } from '../../../../../environments/environment';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authData = inject(AuthData);
  return authData.checkAuthStatus().pipe(
    tap((isAuth) => {
      if (!isAuth) {
        window.location.href = `${environment.baseUrl}/auth/login?returnUrl=${state.url}`;
      }
    })
  );

  // try {
  //   await lastValueFrom(authData.checkAuthStatus());
  //   return true;
  // } catch (e) {
  //   // 🔥 Navegación nativa → NO activa Angular Router → NO intenta parsear nada
  //   window.location.href = '/api/auth/login';
  //   return false;
  // }
};
