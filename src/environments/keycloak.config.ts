/**
 * Here you can add the configuration related to keycloak
 * So we can use this common config for different environments
 */
import {KeycloakConfig, KeycloakInitOptions} from "keycloak-js";

const config: KeycloakConfig = {
  url: "https://ppsso.krauser.com.ar",
  realm: "krauser-dev",
  clientId: "sale-system-frontend",
};

const keycloakInitConfig: KeycloakInitOptions = {
  checkLoginIframe: false,
};

const keycloakConfig = {
  initConfig: config,
  initOptions: keycloakInitConfig,
};

export default keycloakConfig;
