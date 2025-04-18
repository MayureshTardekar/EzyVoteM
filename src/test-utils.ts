import '@testing-library/jest-dom';

// Extend the existing matchers
declare module '@jest/expect' {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveStyle(style: Record<string, any>): R;
  }
}

// No need to redeclare Window interface here since it's in window.d.ts

export { };

