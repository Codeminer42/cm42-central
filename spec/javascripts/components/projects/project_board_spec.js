import React from 'react';
import { shallow } from 'enzyme';
import ProjectBoard from 'components/projects/ProjectBoard';
import ProjectLoading from 'components/projects/ProjectLoading';

describe('<ProjectBoard />', () => {
  describe('when projectBoard.isFetched is false',  () => {
    it('renders <ProjectLoading />', () => {
      const fakeProjectBoard = { isFetched: false };
      const wrapper = shallow(<ProjectBoard projectBoard={fakeProjectBoard} />);
      const spinnerLoading = wrapper.find('[data-id="project-loading"]');

      expect(spinnerLoading).toBeTruthy();
    });
  });

  describe('when projectBoard.isFetched is true', () => {
    it('does not renders <ProjectLoading />', () => {
      const fakeProjectBoard = { isFetched: true };
      const wrapper = shallow(<ProjectBoard projectBoard={fakeProjectBoard} />);

      expect(wrapper.contains(<ProjectLoading />)).toBeFalsy()
    });
  });
});
