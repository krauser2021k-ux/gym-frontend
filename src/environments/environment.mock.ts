import keycloakConfig from "./keycloak.config";
import {createInterceptorCondition, IncludeBearerTokenCondition} from "keycloak-angular";

export const environment = {
    production: false,
    mock: true,
    apiUrl: 'http://localhost:3000/api',
    keycloak: keycloakConfig,
    urlCondition: createInterceptorCondition<IncludeBearerTokenCondition>({
        urlPattern: /.*/,
        bearerPrefix: 'Bearer',
    }),
    mercadoPago: {
        publicKey: 'TEST-mock-key'
    }
};
