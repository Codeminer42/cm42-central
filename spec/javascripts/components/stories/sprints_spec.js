import React from 'react';
import Sprints from 'components/stories/Sprints';
import { renderWithProviders } from '../setupRedux';
import { DragDropContext } from 'react-beautiful-dnd';

vi.mock('react-clipboard.js', () => ({
  default: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

let props = {};

const createProps = () => ({
  stories: [
    {
      id: 1,
      position: '3',
      state: 'unstarted',
      estimate: 1,
      storyType: 'feature',
      _editing: {},
      notes: [],
      tasks: [],
    },
    {
      id: 2,
      position: '2',
      state: 'unstarted',
      estimate: 1,
      storyType: 'feature',
      _editing: {},
      notes: [],
      tasks: [],
    },
  ],
  project: {
    startDate: '2018-09-03T16:00:00',
    iterationLength: 1,
    defaultVelocity: 2,
  },
  sprints: [
    {
      completedPoints: 0,
      isFiller: false,
      number: 1,
      points: 1,
      remainingPoints: 1,
      startDate: '',
      stories: [
        {
          id: 1,
          position: '3',
          state: 'unstarted',
          estimate: 1,
          storyType: 'feature',
          _editing: {},
          notes: [],
          tasks: [],
        },
        {
          id: 2,
          position: '2',
          state: 'unstarted',
          estimate: 1,
          storyType: 'feature',
          _editing: {},
          notes: [],
          tasks: [],
        },
      ],
    },
  ],
  isDropDisabled: false,
});

describe('<Sprints />', () => {
  const renderComponent = props => {
    return renderWithProviders(
      <DragDropContext onDragEnd={vi.fn}>
        <Sprints {...props} />
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

  beforeEach(() => {
    props = createProps();
  });

  it('renders one <Sprint> components', () => {
    const { container } = renderComponent();

    expect(container.querySelector('.Sprints')).toBeInTheDocument();
  });

  describe('when no sprints are passed as props', () => {
    beforeEach(() => {
      props = createProps();
      props.sprints = [];
    });

    it('does not render any <Sprint> component', () => {
      const { container } = renderComponent();

      expect(container.querySelector('.Sprint')).not.toBeInTheDocument();
    });
  });
});
