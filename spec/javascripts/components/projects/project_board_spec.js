import React from 'react';
import ReactDOM from 'react-dom';
import store from 'store';
import { ProjectBoard } from 'components/projects/ProjectBoard';
import storyFactory from '../../support/factories/storyFactory';
import { renderWithProviders } from '../setupRedux';
import { beforeAll } from 'vitest';

vi.mock('../../../../app/assets/javascripts/pusherSockets', () => ({
  subscribeToProjectChanges: vi.fn(),
}));

describe('<ProjectBoard />', () => {
  const renderComponent = props => {
    const defaultProps = {
      projectBoard: {
        isFetched: false,
        isInitialLoading: true,
        search: {
          loading: false,
        },
        reverse: false,
        visibleColumns: {
          backlog: true,
          done: true,
          chillyBin: true,
        },
      },
      doneSprints: [],
      backlogSprints: [],
      fetchProjectBoard: vi.fn(),
      createStory: vi.fn(),
      closeHistory: vi.fn(),
      notifications: [],
      history: {
        status: 'DISABLED',
      },
      onRemove: vi.fn(),
      removeNotification: vi.fn(),
      toggleColumn: vi.fn(),
      reverseColumns: vi.fn(),
      projectId: '1',
      fetchPastStories: vi.fn(),
      epicStories: [],
      chillyBinStories: [],
    };

    const mergedProps = {
      ...defaultProps,
      ...props,
      projectBoard: {
        ...defaultProps.projectBoard,
        ...props?.projectBoard,
        search: {
          ...defaultProps.projectBoard.search,
          ...props?.projectBoard?.search,
        },
        visibleColumns: {
          ...defaultProps.projectBoard.visibleColumns,
          ...props?.projectBoard?.visibleColumns,
        },
      },
      history: {
        ...defaultProps.history,
        ...props?.history,
      },
    };

    return renderWithProviders(<ProjectBoard {...mergedProps} />, {
      store,
    });
  };

  beforeAll(() => {
    ReactDOM.createPortal = vi.fn(element => {
      return element;
    });
  });

  afterEach(() => {
    ReactDOM.createPortal.mockClear();
  });

  describe('when projectBoard.isFetched is false and projectBoard.isInitialLoading is true', () => {
    it('renders <ProjectLoading />', () => {
      const { getByTestId } = renderComponent();

      expect(getByTestId('project-loading-component')).toBeInTheDocument();
    });
  });

  describe('when projectBoard.isFetched is true and projectBoard.isInitialLoading is false', () => {
    it('does not renders <ProjectLoading />', () => {
      const { queryByTestId } = renderComponent({
        projectBoard: { isFetched: true, isInitialLoading: false },
      });

      expect(
        queryByTestId('project-loading-component')
      ).not.toBeInTheDocument();
    });

    it('renders <SideBar />', () => {
      const { getByTestId } = renderComponent({
        projectBoard: {
          isFetched: true,
          search: {
            loading: false,
          },
          visibleColumns: {
            backlog: true,
            done: true,
            chillyBin: true,
          },
          reverse: true,
        },
      });

      expect(getByTestId('sidebar-component')).toBeInTheDocument();
    });

    it('render <Notifications />', () => {
      const wrapper = renderComponent({
        projectBoard: {
          isFetched: true,
          search: {
            loading: false,
          },
          visibleColumns: {
            backlog: true,
            done: true,
            chillyBin: true,
          },
          reverse: true,
        },
      });

      expect(wrapper.find('[data-id="notifications"]')).toExist();
    });

    it('render <Columns />', () => {
      const wrapper = renderComponent({
        projectBoard: {
          isFetched: true,
          search: {
            loading: false,
          },
          visibleColumns: {
            backlog: true,
            done: true,
            chillyBin: true,
          },
          reverse: true,
        },
      });

      expect(wrapper.find('[data-id="columns"]')).toExist();
    });
  });

  describe('when history status is LOADING', () => {
    const props = {
      history: {
        status: 'LOADING',
        storyTitle: 'I am title!',
        activities: [],
      },
      projectBoard: {
        isFetched: true,
        search: {
          loading: false,
        },
        reverse: false,
        visibleColumns: {
          backlog: true,
          done: true,
          chillyBin: true,
        },
      },
    };

    it('renders history column', () => {
      const wrapper = renderComponent(props);

      expect(wrapper.find('[data-id="history-column"]')).toExist();
    });

    it('does not render history', () => {
      const wrapper = renderComponent(props);

      expect(wrapper.find('[data-id="history"]')).not.toExist();
    });

    it('renders loading', () => {
      const wrapper = renderComponent(props);

      expect(wrapper.find('[data-id="project-loading"]')).toExist();
    });
  });

  describe('when history status is LOADED', () => {
    const props = {
      history: {
        status: 'LOADED',
        storyTitle: 'I am title!',
        activities: [],
      },
      projectBoard: {
        isFetched: true,
        search: {
          loading: false,
        },
        reverse: false,
        visibleColumns: {
          backlog: true,
          done: true,
          chillyBin: true,
        },
      },
    };

    it('renders history column', () => {
      const wrapper = renderComponent(props);

      expect(wrapper.find('[data-id="history-column"]')).toExist();
    });

    it('renders history', () => {
      const wrapper = renderComponent(props);

      expect(wrapper.find('[data-id="history"]')).toExist();
    });

    it('does not render loading', () => {
      const wrapper = renderComponent(props);

      expect(wrapper.find('[data-id="project-loading"]')).not.toExist();
    });
  });

  describe('when history status is DISABLED', () => {
    const props = {
      history: {
        status: 'DISABLED',
        storyTitle: 'I am title!',
        activities: [],
      },
      projectBoard: {
        isFetched: true,
        search: {
          loading: false,
        },
        reverse: false,
        visibleColumns: {
          backlog: true,
          done: true,
          chillyBin: true,
        },
      },
    };

    it('does not render history column', () => {
      const wrapper = renderComponent(props);

      expect(wrapper.find('[data-id="history-column"]')).not.toExist();
    });

    it('does not render history', () => {
      const wrapper = renderComponent(props);

      expect(wrapper.find('[data-id="history"]')).not.toExist();
    });

    it('does not render loading', () => {
      const wrapper = renderComponent(props);

      expect(wrapper.find('[data-id="project-loading"]')).not.toExist();
    });
  });

  describe('when history status is FAILED', () => {
    const props = {
      history: {
        status: 'FAILED',
        storyTitle: 'I am title!',
        activities: [],
      },
      projectBoard: {
        isFetched: true,
        search: {
          loading: false,
        },
        reverse: false,
        visibleColumns: {
          backlog: true,
          done: true,
          chillyBin: true,
        },
      },
    };

    it('renders history column', () => {
      const wrapper = renderComponent(props);

      expect(wrapper.find('[data-id="history-column"]')).toExist();
    });

    it('does not render history', () => {
      const wrapper = renderComponent(props);

      expect(wrapper.find('[data-id="history"]')).not.toExist();
    });

    it('renders loading', () => {
      const wrapper = renderComponent(props);

      expect(wrapper.find('[data-id="project-loading"]')).toExist();
    });
  });

  describe('when there are epicStories', () => {
    it('renders epic column', () => {
      const props = {
        epicStories: [storyFactory()],
        projectBoard: {
          isFetched: true,
          search: {
            loading: false,
          },
          reverse: false,
          visibleColumns: {
            backlog: true,
            done: true,
            chillyBin: true,
          },
        },
      };
      const wrapper = renderComponent(props);

      expect(wrapper.find('[data-id="epic-column"]')).toExist();
    });
  });

  describe('when epicStories is empty', () => {
    it('does not render epic column', () => {
      const props = {
        epicStories: [],
        projectBoard: {
          isFetched: true,
          search: {
            loading: false,
          },
          reverse: false,
          visibleColumns: {
            backlog: true,
            done: true,
            chillyBin: true,
          },
        },
      };
      const wrapper = renderComponent(props);

      expect(wrapper.find('[data-id="epic-column"]')).not.toExist();
    });
  });
});
