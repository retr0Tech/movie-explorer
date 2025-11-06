// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder (required for Auth0)
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Auth0
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isLoading: false,
    isAuthenticated: true,
    user: { sub: 'user123', email: 'test@example.com' },
    getAccessTokenSilently: jest.fn().mockResolvedValue('mock-token'),
    loginWithRedirect: jest.fn(),
    logout: jest.fn(),
  }),
  withAuthenticationRequired: (component: any) => component,
}));
