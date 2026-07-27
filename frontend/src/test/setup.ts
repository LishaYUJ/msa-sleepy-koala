import '@testing-library/jest-dom';

// jsdom does not implement matchMedia; provide a minimal stub so the Zustand
// store (which reads prefers-color-scheme on initialisation) can be imported.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
