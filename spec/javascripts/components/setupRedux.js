import React from 'react';
import { render } from '@testing-library/react';
import { testStore } from 'store';
import { Provider } from 'react-redux';

export function renderWithProviders(ui, extendedRenderOptions = {}) {
  const {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = testStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions;

  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
