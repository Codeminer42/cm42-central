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
      }
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
});
