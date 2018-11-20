import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
import StoryDescriptionIcon from 'components/story/StoryDescriptionIcon';
import storyFactory from '../../support/factories/storyFactory';


describe('<StoryDescriptionIcon />', () => {

  beforeEach(() => {
    jasmineEnzyme();
  });

  describe('When description is null',() => {
    it('renders nothing', () => {
      const props = storyFactory({ description: null })
      const wrapper = shallow(<StoryDescriptionIcon {...props} />);
      expect(wrapper.find(StoryDescriptionIcon)).not.toExist();
    });
  });
  describe('When description exists',() => {
    it('renders the description icon', () => {
      const props = storyFactory();
      const wrapper = shallow(<StoryDescriptionIcon {...props} />);
      expect(wrapper).toHaveClassName('Story__description-icon');
    });
  });
});
