import React from 'react';
import ReactDOM from 'react-dom';
import store from 'store';
import { ProjectBoard } from 'components/projects/ProjectBoard';
import storyFactory from '../../support/factories/storyFactory';
import { renderWithProviders } from '../setupRedux';
import { beforeAll, beforeEach } from 'vitest';

vi.mock('../../../../app/assets/javascripts/pusherSockets', () => ({
  subscribeToProjectChanges: vi.fn(),
}));

describe('<ProjectBoard />', () => {
  const COLUMNS_QUANTITY_STD = 3;

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

      expect(getByTestId('notifications-component')).toBeInTheDocument();
    });

    it('render <Columns />', () => {
      const { getAllByTestId } = renderComponent({
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

      expect(getAllByTestId('column-container').length).toBe(
        COLUMNS_QUANTITY_STD
      );
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
      const { container } = renderComponent(props);

      expect(container).toBeInTheDocument();
    });

    it('does not render history', () => {
      const { queryByTestId } = renderComponent(props);

      expect(queryByTestId('history-component')).not.toBeInTheDocument();
    });

    it('renders loading', () => {
      const { getByTestId } = renderComponent(props);

      expect(getByTestId('project-loading-component')).toBeInTheDocument();
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
      const { getAllByTestId } = renderComponent(props);

      expect(getAllByTestId('column-container').length).toBe(
        COLUMNS_QUANTITY_STD + 1
      );
    });

    it('renders history', () => {
      const { getByTestId } = renderComponent(props);

      expect(getByTestId('history-component')).toBeInTheDocument();
    });

    it('does not render loading', () => {
      const { queryByTestId } = renderComponent(props);

      expect(
        queryByTestId('project-loading-component')
      ).not.toBeInTheDocument();
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
      const { getAllByTestId } = renderComponent(props);

      expect(getAllByTestId('column-container').length).toBe(
        COLUMNS_QUANTITY_STD
      );
    });

    it('does not render history', () => {
      const { queryByTestId } = renderComponent(props);

      expect(queryByTestId('history-component')).not.toBeInTheDocument();
    });

    it('does not render loading', () => {
      const { queryByTestId } = renderComponent(props);

      expect(
        queryByTestId('project-loading-component')
      ).not.toBeInTheDocument();
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
      const { getAllByTestId } = renderComponent(props);

      expect(getAllByTestId('column-container').length).toBe(
        COLUMNS_QUANTITY_STD + 1
      );
    });

    it('does not render history', () => {
      const { queryByTestId } = renderComponent(props);

      expect(queryByTestId('history-component')).not.toBeInTheDocument();
    });

    it('renders loading', () => {
      const { getByTestId } = renderComponent(props);

      expect(getByTestId('project-loading-component')).toBeInTheDocument();
    });
  });

  describe('when there are epicStories', () => {
    beforeAll(() => {
      vi.spyOn(window.md, 'makeHtml').mockReturnValue('<p>Teste</p>');
    });

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

      const { getAllByTestId } = renderComponent(props);

      expect(getAllByTestId('column-container').length).toBe(
        COLUMNS_QUANTITY_STD + 1
      );
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
      const { getAllByTestId } = renderComponent(props);

      expect(getAllByTestId('column-container').length).toBe(
        COLUMNS_QUANTITY_STD
      );
    });
  });
});
