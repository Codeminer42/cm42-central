import React from 'react';
import ReactDOM from 'react-dom';
import store from 'store';
import SearchResults from 'components/search/Search';
import { renderWithProviders } from '../setupRedux';

describe('<SearchResults />', () => {
  const renderComponent = props => {
    return renderWithProviders(
      <SearchResults
        isEnabled={false}
        searchResults={[]}
        closeSearch={vi.fn()}
        {...props}
      />,
      {
        store,
      }
    );
  };

  describe('when isEnabled is false', () => {
    it('does not render the component', () => {
      const { container } = renderComponent();

      expect(container).not.toBeInTheDocument();
    });
  });

  describe('when isEnabled is true', () => {
    it('renders the component', () => {
      const { container } = renderComponent({ isEnabled: true });

      expect(container).toBeInTheDocument();
    });
  });
});
