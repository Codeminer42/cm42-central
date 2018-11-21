import React from 'react';
import { shallow } from 'enzyme';
import CollapsedStory from 'components/story/CollapsedStory/index';
import storyFactory from '../../../support/factories/storyFactory';

describe('<CollapsedStory />', () => {
  
  describe('when estimate isn\'t null', () => {
    it('renders the component with estimated className', () => {
      const props = storyFactory({storyType: 'feature', estimate: 1});
      const wrapper = shallow(<CollapsedStory story={props} />);

      expect(wrapper).toHaveClassName('Story--estimated');
    });
  });
  
  describe('when estimate is null', () => {
    it('renders the component with unestimated className', () => {
      const props = storyFactory({storyType: 'feature', estimate: null});
      const wrapper = shallow(<CollapsedStory story={props} />);

      expect(wrapper.prop('className')).toContain('Story--unestimated');
    });
  });
  
  describe('when storyType = release', () => {
    it('renders the component with release className', () => {
      const props = storyFactory({storyType: 'release'});
      const wrapper = shallow(<CollapsedStory story={props} />);

      expect(wrapper).toHaveClassName('Story--release');
    });
  });
  
  it('renders children components', () => {
    const props = storyFactory({storyType: 'feature', estimate: 1});
    const wrapper = shallow(<CollapsedStory story={props} />);

    expect(wrapper.find('StoryPopover')).toExist();
    expect(wrapper.find('CollapsedStoryIcon')).toExist();
    expect(wrapper.find('CollapsedStoryEstimate')).toExist();
    expect(wrapper.find('StoryDescriptionIcon')).toExist();
    expect(wrapper.find('CollapsedStoryInfo')).toExist();
    expect(wrapper.find('CollapsedStoryStateActions')).toExist();
  });
});
