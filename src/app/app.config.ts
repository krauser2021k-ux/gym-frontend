import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {routes} from './app.routes';
import {mockServerInterceptor} from './core/mock-server.interceptor';
import {INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, provideKeycloak} from "keycloak-angular";
import {environment} from "../environments/environment.mock";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideKeycloak({
            config: {
                url: environment.keycloak.initConfig.url,
                realm: environment.keycloak.initConfig.realm,
                clientId: environment.keycloak.initConfig.clientId,
            },
            initOptions: {
                onLoad: 'login-required',
                checkLoginIframe: environment.keycloak.initOptions.checkLoginIframe,
                //   redirectUri: window.location.origin + ''
            },
            providers: [
                {
                    provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
                    useValue: [environment.urlCondition]
                },
            ]
        }),
        provideHttpClient(withInterceptors([mockServerInterceptor])),
    ]
};
