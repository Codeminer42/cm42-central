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
            labels: [],
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
      const { container } = renderComponent();

      expect(container.querySelector('.Sprint__header')).toBeInTheDocument();
    });

    it('renders stories', () => {
      const { container } = renderComponent();

      expect(container.querySelector('.Sprint__header')).toBeInTheDocument();
      expect(container.querySelector('.Sprint__body')).toBeInTheDocument();
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
      const { container } = renderComponent();

      expect(container.querySelector('.Sprint__header')).toBeInTheDocument();
    });

    it('renders stories', () => {
      const { container } = renderComponent();

      expect(container.querySelector('.Sprint__body')).toBeInTheDocument();
    });
  });
});
