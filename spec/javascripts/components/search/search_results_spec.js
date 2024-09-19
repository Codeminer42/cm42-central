import React from 'react';
import SearchResults from 'components/search/SearchResults';
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
  const renderComponent = state => {
    return renderWithProviders(
      <DragDropContext onDragEnd={vi.fn()} onDragUpdate={vi.fn()}>
        <SearchResults />
      </DragDropContext>,
      {
        preloadedState: state,
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
    it.only('renders the component', () => {
      const { getByTestId, store } = renderComponent({
        stories: {
          all: {
            stories: [emptyStory, emptyStory, emptyStory],
          },
          epic: {
            stories: [emptyStory, emptyStory, emptyStory],
          },
          search: {
            stories: [emptyStory, emptyStory, emptyStory],
          },
        },
      });

      const state = store.getState();
      console.log(state);

      expect(getByTestId('sprint-container')).toBeInTheDocument();
    });
  });
});
