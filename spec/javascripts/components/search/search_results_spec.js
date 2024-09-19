import React from 'react';
import { SearchResults } from 'components/search/SearchResults';
import { renderWithProviders } from '../setupRedux';
import { DragDropContext } from 'react-beautiful-dnd';

const emptyStory = {
  title: '',
  description: null,
  estimate: '',
  storyType: 'feature',
  state: 'unscheduled',
  acceptedAt: null,
  requestedById: null,
  ownedById: null,
  projectId: null,
  createdAt: '',
  updatedAt: '',
  position: '',
  newPosition: null,
  labels: [],
  requestedByName: '',
  ownedByName: null,
  ownedByInitials: null,
  releaseDate: null,
  deliveredAt: null,
  errors: {},
  notes: [],
  tasks: [],
};

describe('<SearchResults />', () => {
  const renderComponent = props => {
    const defaultProps = {
      isEnabled: false,
      searchResults: [],
      closeSearch: vi.fn(),
      projectBoard: {
        search: {},
      },
    };

    const mergeProps = {
      ...defaultProps,
      ...props,
    };

    return renderWithProviders(
      <DragDropContext onDragEnd={vi.fn()} onDragUpdate={vi.fn()}>
        <SearchResults {...mergeProps} />
      </DragDropContext>,
      {}
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
      const { getByTestId } = renderComponent({ isEnabled: true });

      expect(getByTestId('sprint-container')).toBeInTheDocument();
    });
  });
});
