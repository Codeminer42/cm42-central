import React from 'react';
import { shallow } from 'enzyme';
import { CollapsedStory } from 'components/story/CollapsedStory/index';
import storyFactory from '../../../support/factories/storyFactory';

describe('<CollapsedStory />', () => {
  const defaultProps = () => ({
    story: {},
    onToggle: sinon.stub(),
    title: '',
    className: '',
    from: 'all', 
    highlight: sinon.stub(),
    stories: {
      all: [],
      search: []
    }
  });

  describe('when estimate isn\'t null', () => {
    it('renders the component with Story--estimated className', () => {
      const story = storyFactory({ storyType: 'feature', estimate: 1 });
      const wrapper = shallow(<CollapsedStory {...defaultProps()} story={story} />);

      expect(wrapper).toHaveClassName('Story--estimated');
    });
  });

  describe('when estimate is null', () => {
    it('renders the component with Story--unestimated className', () => {
      const story = storyFactory({ storyType: 'feature', estimate: null });
      const wrapper = shallow(<CollapsedStory {...defaultProps()} story={story} />);

      expect(wrapper).toHaveClassName('Story--unestimated');
    });
  });

  describe('when storyType = release', () => {
    it('renders the component with Story--release className', () => {
      const story = storyFactory({ storyType: 'release' });
      const wrapper = shallow(<CollapsedStory {...defaultProps()} story={story} />);

      expect(wrapper).toHaveClassName('Story--release');
    });
  });

  it('renders children components', () => {
    const story = storyFactory({ storyType: 'feature', estimate: 1 });
    const wrapper = shallow(<CollapsedStory {...defaultProps()} story={story} />);

    expect(wrapper.find('StoryPopover')).toExist();
    expect(wrapper.find('CollapsedStoryIcon')).toExist();
    expect(wrapper.find('CollapsedStoryEstimate')).toExist();
    expect(wrapper.find('StoryDescriptionIcon')).toExist();
    expect(wrapper.find('CollapsedStoryInfo')).toExist();
    expect(wrapper.find('CollapsedStoryStateActions')).toExist();
  });
});
