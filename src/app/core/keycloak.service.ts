import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../environments/environment';
import { User } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloak: Keycloak;
  private initialized = false;

  constructor() {
    this.keycloak = new Keycloak({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId
    });
  }

  async init(): Promise<boolean> {
    if (this.initialized) {
      return true;
    }

    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        checkLoginIframe: false
      });
      this.initialized = true;
      return authenticated;
    } catch (error) {
      console.error('Keycloak initialization failed:', error);
      return false;
    }
  }

  login(): Promise<void> {
    return this.keycloak.login();
  }

  logout(): Promise<void> {
    return this.keycloak.logout();
  }

  isAuthenticated(): boolean {
    return this.keycloak.authenticated || false;
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  async refreshToken(): Promise<boolean> {
    try {
      return await this.keycloak.updateToken(70);
    } catch {
      return false;
    }
  }

  getUserFromToken(): Partial<User> | null {
    if (!this.keycloak.tokenParsed) {
      return null;
    }

    const token = this.keycloak.tokenParsed as any;
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
