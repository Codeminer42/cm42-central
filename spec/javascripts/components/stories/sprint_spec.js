import React from 'react';
import Sprint from 'components/stories/Sprint';
import { DragDropContext } from 'react-beautiful-dnd';
import { renderWithProviders } from '../setupRedux';
import { fireEvent } from '@testing-library/react';

vi.mock('react-clipboard.js', () => ({
  default: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

const createSprint = propOverrides => ({
  number: 1,
  startDate: '2018/09/03',
  endDate: '2018/09/10',
  points: 3,
  completedPoints: 0,
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
  isDropDisabled: false,
  ...propOverrides,
});

describe('<Sprint />', () => {
  let sprint = {};

  const renderComponent = props => {
    return renderWithProviders(
      <DragDropContext onDragEnd={vi.fn}>
        <Sprint sprint={sprint} {...props} />
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
    sprint = createSprint();
  });

  it('renders a <div> with class ".Sprint"', () => {
    const { container } = renderComponent();

    expect(container.querySelector('div.Sprint')).toBeInTheDocument();
  });

  it('renders a SprintHeader component"', () => {
    const { container } = renderComponent();

    expect(container.querySelector('.Sprint__header')).toBeInTheDocument();
  });

  it('renders a div with class ".Sprint__body"', () => {
    const { container } = renderComponent();

    expect(container.querySelector('div.Sprint__body')).toBeInTheDocument();
  });

  it('renders a <Stories> components', () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('stories-container')).toBeInTheDocument();
  });

  describe('when no stories are passed as sprint', () => {
    beforeEach(() => {
      sprint = createSprint();
      sprint.stories = null;
    });

    it('does not render any <Stories> component', () => {
      const { queryByTestId } = renderComponent();

      expect(queryByTestId('stories-container')).not.toBeInTheDocument();
    });
  });

  describe('when story needs to fetch', () => {
    let fetchStories;

    beforeEach(() => {
      sprint = createSprint({
        fetching: false,
        isFetched: false,
        hasStories: true,
      });
      sprint.stories = null;
      fetchStories = vi.fn();
    });

    it('calls fetchStories with iteration number, start and end date on user click', () => {
      const { number, startDate, endDate } = sprint;
      const { container } = renderComponent({ fetchStories });

      const header = container.querySelector('.Sprint__header');

      fireEvent.click(header);

      expect(fetchStories).toHaveBeenCalledWith(number, startDate, endDate);
    });
  });
});
