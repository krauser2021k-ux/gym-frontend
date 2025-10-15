export const environment = {
  production: false,
  mock: true,
  apiUrl: 'http://localhost:3000/api',
  keycloak: {
    url: 'https://auth.example.com/',
    realm: 'gym',
    clientId: 'gym-app'
  },
  mercadoPago: {
    publicKey: 'TEST-mock-key'
  }
};
