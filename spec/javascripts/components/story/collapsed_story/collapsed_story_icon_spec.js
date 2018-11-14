import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
import CollapsedStoryIcon from 'components/story/CollapsedStory/CollapsedStoryIcon';

describe('<CollapsedStoryIcon />', () => {
  
  beforeEach(() => {
    jasmineEnzyme();
  });

  const iconRules = [
    { storyType: 'feature', icon: 'start', className: 'star' },
    { storyType: 'bug', icon: 'bug_report', className: 'bug' },
    { storyType: 'chore', icon: 'settings', className: 'dark' },
    { storyType: 'release', icon: 'bookmark', className: 'bookmark' }
  ];
  iconRules.forEach(({ storyType, icon, className }) => {
    describe(`when storyType = ${storyType}`,() => {
      it('renders the story icon', () => {
        const wrapper = shallow(<CollapsedStoryIcon storyType={storyType} />);

        expect(wrapper.find('i')).toHaveClassName(`mi md-${className} md-16`);
        expect(wrapper.find('.Story__icon').text()).toContain(icon);
      });
    });
  });
});
