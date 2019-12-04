import React from 'react';
import { shallow } from 'enzyme';
import { ProjectBoard } from 'components/projects/ProjectBoard';

describe('<ProjectBoard />', () => {
  const render = props => {
    const defaultProps = {
      projectBoard: {
        isFetched: false,
        search: {
          loading: false
        },
        reverse: false,
        visibleColumns: {
          backlog: true,
          done: true,
          chillyBin: true
        }
      },
      doneSprints: [],
      backlogSprints: [],
      fetchProjectBoard: sinon.stub(),
      createStory: sinon.stub(),
      closeHistory: sinon.stub(),
      notifications: [],
      history: {
        status: 'DISABLED'
      },
      onRemove: sinon.stub(),
      removeNotification: sinon.stub(),
      toggleColumn: sinon.stub(),
      reverseColumns: sinon.stub(),
      projectId: '1',
      fetchPastStories: sinon.stub()
    };

    return shallow(<ProjectBoard {...defaultProps} {...props } />);
  };

  it('renders <SideBar />', () => {
    const wrapper = render({
      projectBoard: { 
        isFetched: true,
        search: {
          loading: false
        },
        visibleColumns: {
          backlog: true,
          done: true,
          chillyBin: true
        },
        reverse: true
      }
    });

    expect(wrapper.find('[data-id="side-bar"]')).toExist();
  });

  it('render <Notifications />', () => {
    const wrapper = render({
      projectBoard: { 
        isFetched: true,
        search: {
          loading: false
        },
        visibleColumns: {
          backlog: true,
          done: true,
          chillyBin: true
        },
        reverse: true
      },
    });

    expect(wrapper.find('[data-id="notifications"]')).toExist();
  });

  describe('when projectBoard.isFetched is false',  () => {
    it('renders <ProjectLoading />', () => {
      const wrapper = render();
      const spinnerLoading = wrapper.find('[data-id="project-loading"]');

      expect(spinnerLoading.exists()).toBeTruthy();
    });
  });

  describe('when projectBoard.isFetched is true', () => {
    it('does not renders <ProjectLoading />', () => {
      const wrapper = render({
        projectBoard: { 
          isFetched: true,
          search: {
            loading: false
          },
          visibleColumns: {
            backlog: true,
            done: true,
            chillyBin: true
          },
          reverse: true
        },
      });
      const spinnerLoading = wrapper.find('[data-id="project-loading"]');

      expect(spinnerLoading.exists()).toBeFalsy();
    });
  });

  describe('when projectBoard.reverse is false', () => {
    const aditionalProps = {
      projectBoard: {
        isFetched: true,
        search: {
          loading: false
        },
        reverse: false,
        visibleColumns: {
          backlog: true,
          done: true,
          chillyBin: true
        }
      }
    };

    it('renders normal-column', () => {
      const wrapper = render(aditionalProps);
      const normalColumn = wrapper.find('[data-id="normal-column"]');

      expect(normalColumn.exists()).toBeTruthy();
    });

    it('does not render reversed-column', () => {
      const wrapper = render(aditionalProps);
      const reversedColumn = wrapper.find('[data-id="reversed-column"]');

      expect(reversedColumn.exists()).toBeFalsy();
    });
  });

  describe('when projectBoard.reverse is true', () => {
    const aditionalProps = {
      projectBoard: {
        isFetched: true,
        search: {
          loading: false
        },
        reverse: true,
        visibleColumns: {
          backlog: true,
          done: true,
          chillyBin: true
        }
      }
    };

    it('renders reversed-column', () => {
      const wrapper = render(aditionalProps);
      const reversedColumn = wrapper.find('[data-id="reversed-column"]');

      expect(reversedColumn.exists()).toBeTruthy();
    });

    it('does not renders normal-column', () => {
      const wrapper = render(aditionalProps);
      const normalColumn = wrapper.find('[data-id="normal-column"]');

      expect(normalColumn.exists()).toBeFalsy();
    });
  });

  describe('when history status is LOADING', () => {
    const props = {
      history: {
        status: 'LOADING',
        storyTitle: 'I am title!',
        activities: []
      },
      projectBoard: { 
        isFetched: true,
        search: {
          loading: false
        },
        reverse: false,
        visibleColumns: {
          backlog: true,
          done: true,
          chillyBin: true
        }
      },
    };

    it('renders history column', () => {
      const wrapper = render(props);

      expect(wrapper.find('[data-id="history-column"]')).toExist();
    });

    it('does not render history', () => {
      const wrapper = render(props);

      expect(wrapper.find('[data-id="history"]')).not.toExist();
    });

    it('renders loading', () => {
      const wrapper = render(props);

      expect(wrapper.find('[data-id="project-loading"]')).toExist();
    });
  });

  describe('when history status is LOADED', () => {
    const props = {
      history: {
        status: 'LOADED',
        storyTitle: 'I am title!',
        activities: []
      },
      projectBoard: { 
        isFetched: true,
        search: {
          loading: false
        },
        reverse: false,
        visibleColumns: {
          backlog: true,
          done: true,
          chillyBin: true
        }
      },
    };

    it('renders history column', () => {
      const wrapper = render(props);

      expect(wrapper.find('[data-id="history-column"]')).toExist();
    });

    it('renders history', () => {
      const wrapper = render(props);

      expect(wrapper.find('[data-id="history"]')).toExist();
    });

    it('does not render loading', () => {
      const wrapper = render(props);

      expect(wrapper.find('[data-id="project-loading"]')).not.toExist();
    });
  });

  describe('when history status is DISABLED', () => {
    const props = {
      history: {
        status: 'DISABLED',
        storyTitle: 'I am title!',
        activities: []
      },
      projectBoard: { 
        isFetched: true,
        search: {
          loading: false
        },
        reverse: false,
        visibleColumns: {
          backlog: true,
          done: true,
          chillyBin: true
        }
      },
    };

    it('does not render history column', () => {
      const wrapper = render(props);

      expect(wrapper.find('[data-id="history-column"]')).not.toExist();
    });

    it('does not render history', () => {
      const wrapper = render(props);

      expect(wrapper.find('[data-id="history"]')).not.toExist();
    });

    it('does not render loading', () => {
      const wrapper = render(props);

      expect(wrapper.find('[data-id="project-loading"]')).not.toExist();
    });
  });

  describe('when history status is FAILED', () => {
    const props = {
      history: {
        status: 'FAILED',
        storyTitle: 'I am title!',
        activities: []
      },
      projectBoard: { 
        isFetched: true,
        search: {
          loading: false
        },
        reverse: false,
        visibleColumns: {
          backlog: true,
          done: true,
          chillyBin: true
        }
      },
    };

    it('renders history column', () => {
      const wrapper = render(props);

      expect(wrapper.find('[data-id="history-column"]')).toExist();
    });

    it('does not render history', () => {
      const wrapper = render(props);

      expect(wrapper.find('[data-id="history"]')).not.toExist();
    });

    it('renders loading', () => {
      const wrapper = render(props);

      expect(wrapper.find('[data-id="project-loading"]')).toExist();
    });
  });
});
