import {Injectable} from '@angular/core';
import Keycloak from 'keycloak-js';
import {environment} from '../../environments/environment';
import {User} from '../shared/models';

@Injectable({
    providedIn: 'root'
})
export class KeycloakService {
    private initialized = false;

    constructor(private keycloakService: Keycloak) {
    }


    login(): Promise<void> {
        return this.keycloakService.login();
    }

    logout(): Promise<void> {
        return this.keycloakService.logout();
    }

    isAuthenticated(): boolean {
        return this.keycloakService.authenticated || false;
    }

    getToken(): string | undefined {
        return this.keycloakService.token;
    }

    async refreshToken(): Promise<boolean> {
        try {
            return await this.keycloakService.updateToken(70);
        } catch {
            return false;
        }
    }

    getUserFromToken(): Partial<User> | null {
        if (!this.keycloakService.tokenParsed) {
            return null;
        }

        const token = this.keycloakService.tokenParsed as any;
        return {
            id: token.sub || '',
            email: token['email'] || '',
            firstName: token['given_name'] || '',
            lastName: token['family_name'] || '',
            role: token.realm_access?.roles?.includes('admin') ? 'admin' :
                token.realm_access?.roles?.includes('trainer') ? 'trainer' : 'student'
        };
    }
}
