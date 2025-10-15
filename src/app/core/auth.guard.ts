import {inject} from '@angular/core';
import {Router, CanActivateFn} from '@angular/router';
import {KeycloakService} from './keycloak.service';

export const authGuard: CanActivateFn = async (route, state) => {
    const keycloakService = inject(KeycloakService);
    const router = inject(Router);

    if (!keycloakService.isAuthenticated()) {
        await keycloakService.login();
        return false;
    }

    return true;
};
