import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

export function renderWithProviders(ui, { store } = {}) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper }) };
}
