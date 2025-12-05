import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { AuthData } from '../../datasources/auth-data';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authData = inject(AuthData);
  return authData.checkAuthStatus();
};
