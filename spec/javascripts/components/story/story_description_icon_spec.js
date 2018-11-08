import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
import StoryDescriptionIcon from 'components/story/StoryDescriptionIcon';

beforeEach(() => {
  jasmineEnzyme();
});

describe('<StoryDescriptionIcon />', () => {
  describe('When description is null',() => {
    it('renders nothing', () => {
      const props = {
        description: null
      };
      const wrapper = shallow(<StoryDescriptionIcon {...props} />);
      expect(wrapper.find(StoryDescriptionIcon)).not.toExist();
    });
  });
  describe('When description exists',() => {
    it('renders the description icon', () => {
      const props = {
        description: 'Story Description'
      };
      const wrapper = shallow(<StoryDescriptionIcon {...props} />);
      expect(wrapper).toHaveClassName('Story__description-icon');
    });
  });
});
