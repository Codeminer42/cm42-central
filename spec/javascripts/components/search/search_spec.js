import React from 'react';
import Search from 'components/search/Search';
import { renderWithProviders } from '../setupRedux';
import { DragDropContext } from 'react-beautiful-dnd';

vi.mock('react-clipboard.js', () => ({
  default: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

describe('<Search />', () => {
  const renderComponent = props => {
    return renderWithProviders(
      <DragDropContext onDragEnd={vi.fn()} onDragUpdate={vi.fn()}>
        <Search {...props} />
      </DragDropContext>,
      {
        preloadedState: {
          project: {
            pointValues: [],
          },
        },
      }
    );
  };

  describe('when have not stories', () => {
    it('renders the component', () => {
      const { container } = renderComponent();

      expect(container).toBeInTheDocument();
    });

    it('renders header', () => {
      const { getByTestId } = renderComponent();

      expect(getByTestId('search-header-container')).toBeInTheDocument();
    });

    it('renders stories', () => {
      const { getByTestId } = renderComponent();

      expect(getByTestId('search-header-container')).toBeInTheDocument();
      expect(getByTestId('stories-search-container')).toBeInTheDocument();
    });
  });

  const storiesAmount = [1, 10, 100];

  describe(`when have ${storiesAmount} stories`, () => {
    const stories = Array(storiesAmount).fill({
      estimate: 2,
      id: 1,
      _editing: {},
      notes: [],
      tasks: [],
    });

    it('renders the component', () => {
      const { container } = renderComponent({
        stories,
      });

      expect(container).toBeInTheDocument();
    });

    it('renders header', () => {
      const { getByTestId } = renderComponent();

      expect(getByTestId('search-header-container')).toBeInTheDocument();
    });

    it('renders stories', () => {
      const { getByTestId } = renderComponent();

      expect(getByTestId('stories-search-container')).toBeInTheDocument();
    });
  });
});
