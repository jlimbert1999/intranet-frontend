import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthData } from '../../datasources/auth-data';
import { tap } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authData = inject(AuthData);
  return authData.checkAuthStatus().pipe(
    tap((isAuth) => {
      if (isAuth) return true;
      router.navigateByUrl('/login');
      return false;
    })
  );
};
