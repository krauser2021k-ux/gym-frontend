export const environment = {
  production: false,
  mock: false,
  apiUrl: 'http://localhost:3000/api',
  keycloak: {
    url: 'https://auth.example.com/',
    realm: 'gym',
    clientId: 'gym-app'
  },
  mercadoPago: {
    publicKey: 'TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  }
};
