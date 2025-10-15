import {createInterceptorCondition, IncludeBearerTokenCondition} from "keycloak-angular";
import keycloakConfig from "./keycloak.config";

export const environment = {
    production: false,
    mock: false,
    apiUrl: 'http://localhost:3000/api',
    keycloak: keycloakConfig,
    urlCondition: createInterceptorCondition<IncludeBearerTokenCondition>({
        urlPattern: /.*/,
        bearerPrefix: 'Bearer',
    }),
    mercadoPago: {
        publicKey: 'TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    }
};
