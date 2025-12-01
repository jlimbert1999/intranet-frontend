import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { AuthData } from '../services';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authData = inject(AuthData);
  return authData.checkAuthStatus();
};
