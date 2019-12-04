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
        reverse: false
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
      removeNotification: sinon.stub()
    };

    return shallow(<ProjectBoard {...defaultProps} {...props } />);
  }

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
          }
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
        reverse: false
      }
    }
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
        reverse: true
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
});
