import React from 'react';
import Search from 'components/search/Search';
import { renderWithProviders } from '../setupRedux';
import { DragDropContext } from 'react-beautiful-dnd';

describe('<Search />', () => {
  const renderComponent = props => {
    return renderWithProviders(
      <DragDropContext onDragEnd={vi.fn()} onDragUpdate={vi.fn()}>
        <Search {...props} />
      </DragDropContext>,
      {
        preloadedState: {},
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
    const stories = Array(storiesAmount).fill({ estimate: 2 });
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<Search stories={stories} />);
    });

    it('renders the component', () => {
      expect(wrapper).toExist();
    });

    it('renders header', () => {
      expect(wrapper.find('[data-id="search-header"]')).toBeTruthy();
    });

    it('renders stories', () => {
      expect(wrapper.find('[data-id="stories-search"]')).toBeTruthy();
    });
  });
});
