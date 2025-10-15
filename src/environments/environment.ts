import {createInterceptorCondition, IncludeBearerTokenCondition} from "keycloak-angular";
import keycloakConfig from "./keycloak.config";

export const environment = {
    production: false,
    mock: false,
    apiUrl: 'http://localhost:3000/api',
    supabaseUrl: 'https://whbwearvxuniauafquqe.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoYndlYXJ2eHVuaWF1YWZxdXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NTc0MzIsImV4cCI6MjA3NjEzMzQzMn0.fTWvX3TDhS5Jl2J53vjisLF9WN26PhumzJMNwCtcgso',
    keycloak: keycloakConfig,
    urlCondition: createInterceptorCondition<IncludeBearerTokenCondition>({
        urlPattern: /.*/,
        bearerPrefix: 'Bearer',
    }),
    mercadoPago: {
        publicKey: 'TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    }
};
