import React from 'react';
import store from 'store';
import SearchResults from 'components/search/SearchResults';
import { renderWithProviders } from '../setupRedux';
import { DragDropContext } from 'react-beautiful-dnd';

describe('<SearchResults />', () => {
  const renderComponent = () => {
    return renderWithProviders(
      <DragDropContext onDragEnd={vi.fn()} onDragUpdate={vi.fn()}>
        <SearchResults />
      </DragDropContext>,
      {
        store,
      }
    );
  };

  describe('when isEnabled is false', () => {
    it('does not render the component', () => {
      const { queryByTestId } = renderComponent();

      expect(queryByTestId('sprint-container')).not.toBeInTheDocument();
    });
  });

  describe('when isEnabled is true', () => {
    it('renders the component', () => {
      const { getByTestId } = renderComponent();

      expect(getByTestId('sprint-container')).toBeInTheDocument();
    });
  });
});
