import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { KeycloakService } from './keycloak.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  const authenticated = await keycloakService.init();

  if (!authenticated) {
    await keycloakService.login();
    return false;
  }

  return true;
};
