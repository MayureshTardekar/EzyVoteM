import '@testing-library/jest-dom';
import './test-utils';

// Mock window.ethereum
Object.defineProperty(window, 'ethereum', {
  value: {
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
    addListener: jest.fn(),
    isMetaMask: true,
  },
  writable: true,
});

beforeEach(() => {
  jest.clearAllMocks();
});
