import { inject } from '@angular/core';
import { type CanActivateFn } from '@angular/router';
import { tap } from 'rxjs';

import { AuthDataSource } from '../services/auth-data-source';
import { environment } from '../../../../environments/environment';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authDataSource = inject(AuthDataSource);
  return authDataSource.checkAuthStatus().pipe(
    tap((isAuth) => {
      if (!isAuth) {
        window.location.href = `${environment.baseUrl}/auth/login?returnUrl=${state.url}`;
      }
    })
  );
};
