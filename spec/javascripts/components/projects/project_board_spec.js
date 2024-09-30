import React from 'react';
import ReactDOM from 'react-dom';
import { ProjectBoard } from 'components/projects/ProjectBoard';
import storyFactory from '../../support/factories/storyFactory';
import { renderWithProviders } from '../setupRedux';
import { beforeAll } from 'vitest';

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
      preloadedState: {
        project: {
          id: 1,
        },
      },
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
      const { container } = renderComponent();

      expect(
        container.querySelector('.ProjectBoard-loading')
      ).toBeInTheDocument();
    });
  });

  describe('when projectBoard.isFetched is true and projectBoard.isInitialLoading is false', () => {
    it('does not renders <ProjectLoading />', () => {
      const { container } = renderComponent({
        projectBoard: {
          isFetched: true,
          isInitialLoading: false,
        },
      });

      expect(
        container.querySelector('.ProjectBoard-loading')
      ).not.toBeInTheDocument();
    });

    it('renders <SideBar />', () => {
      const { container } = renderComponent({
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

      expect(container.querySelector('.SideBar')).toBeInTheDocument();
    });

    it('render <Notifications />', () => {
      const { container } = renderComponent({
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

      expect(container.querySelector('.Notifications')).toBeInTheDocument();
    });

    it('render <Columns />', () => {
      const { container } = renderComponent({
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

      expect(container.querySelectorAll('.Column').length).toBe(
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
      const { container } = renderComponent(props);

      expect(container.querySelector('.History')).not.toBeInTheDocument();
    });

    it('renders loading', () => {
      const { container } = renderComponent(props);

      expect(
        container.querySelector('.ProjectBoard-loading')
      ).toBeInTheDocument();
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
      const { container } = renderComponent(props);

      expect(container.querySelectorAll('.Column').length).toBe(
        COLUMNS_QUANTITY_STD + 1
      );
    });

    it('renders history', () => {
      const { container } = renderComponent(props);

      expect(container.querySelector('.History')).toBeInTheDocument();
    });

    it('does not render loading', () => {
      const { container } = renderComponent(props);

      expect(
        container.querySelector('.ProjectBoard-loading')
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
      const { container } = renderComponent(props);

      expect(container.querySelectorAll('.Column').length).toBe(
        COLUMNS_QUANTITY_STD
      );
    });

    it('does not render history', () => {
      const { container } = renderComponent(props);

      expect(container.querySelector('.History')).not.toBeInTheDocument();
    });

    it('does not render loading', () => {
      const { container } = renderComponent(props);

      expect(
        container.querySelector('.ProjectBoard-loading')
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
      const { container } = renderComponent(props);

      expect(container.querySelectorAll('.Column').length).toBe(
        COLUMNS_QUANTITY_STD + 1
      );
    });

    it('does not render history', () => {
      const { container } = renderComponent(props);

      expect(container.querySelector('.History')).not.toBeInTheDocument();
    });

    it('renders loading', () => {
      const { container } = renderComponent(props);

      expect(
        container.querySelector('.ProjectBoard-loading')
      ).toBeInTheDocument();
    });
  });

  describe('when there are epicStories', () => {
    beforeAll(() => {
      vi.spyOn(window.md, 'makeHtml').mockReturnValue('<p>Test</p>');
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

      const { container } = renderComponent(props);

      expect(container.querySelectorAll('.Column').length).toBe(
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
      const { container } = renderComponent(props);

      expect(container.querySelectorAll('.Column').length).toBe(
        COLUMNS_QUANTITY_STD
      );
    });
  });
});
