import React from 'react';
import { shallow } from 'enzyme';
import { StoryItem } from 'components/story/StoryItem';
import storyFactory from '../../support/factories/storyFactory';
import ExpandedStory from 'components/story/ExpandedStory';
import CollapsedStory from 'components/story/CollapsedStory';
import moment from 'moment';

describe('<StoryItem />', () => {
  it('renders the StoryItem component within a Collapsed Story', () => {
    const story = storyFactory({ collapsed: true });
    const wrapper = shallow(<StoryItem story={story} />);

    expect(wrapper.find(CollapsedStory)).toExist();
  });

  it('renders the StoryItem component within a Expanded Story', () => {
    const story = storyFactory({ collapsed: false });
    const wrapper = shallow(<StoryItem story={story} />);

    expect(wrapper.find(ExpandedStory)).toExist();
  });

  describe('when the story is a release that is late', () => {
    it('put .Story--late-release on childrens prop className', () => {
      const story = storyFactory({
        collapsed: false,
        storyType: 'release',
        releaseDate: moment().subtract(3, 'days')
      });
      const className = 'Story--late-release';

      const wrapper = shallow(<StoryItem story={story} />);
      const children = wrapper.find(ExpandedStory);

      expect(children.prop('className')).toContain(className);
    });

    it('put a late release message on childrens prop title', () => {
      const story = storyFactory({
        collapsed: false,
        storyType: 'release',
        releaseDate: moment().subtract(3, 'days')
      });
      const title = I18n.t('story.warnings.backlogged_release');

      const wrapper = shallow(<StoryItem story={story} />);
      const children = wrapper.find(ExpandedStory);

      expect(children).toHaveProp('title', title);
    });
  });

  describe("when the story is a release that isn't late", () => {
    it('do not put a className on children components', () => {
      const story = storyFactory({
        collapsed: false,
        storyType: 'release',
        releaseDate: moment().add(3, 'days')
      });
      const className = '';

      const wrapper = shallow(<StoryItem story={story} />);
      const children = wrapper.find(ExpandedStory);

      expect(children).toHaveProp('className', className);
    });

    it('do not put a title on children components', () => {
      const story = storyFactory({
        collapsed: false,
        storyType: 'release',
        releaseDate: moment().add(3, 'days')
      });
      const title = '';

      const wrapper = shallow(<StoryItem story={story} />);
      const children = wrapper.find(ExpandedStory);

      expect(children).toHaveProp('title', title);
    });
  });

  const render = props => {
    const wrapper = shallow(<StoryItem {...props} />);
    const expandedStory = wrapper.find('[data-id="expanded-story"]');
    return { wrapper, expandedStory };
  }

  describe('when the story is accepted', () => {  
    it('puts .Story--accepted on childrens prop className', () => {
      const { expandedStory } = render({
        story: storyFactory({
          collapsed: false,
          state: 'accepted'
        })
      });
      expect(expandedStory.prop('className')).toContain('Story--accepted');
    });
  });

  describe('when the story is not accepted', () => {
    it('does not put .Story--accepted on childrens prop className', () => {
      const { expandedStory } = render({
        story: storyFactory({
          collapsed: false,
          state: 'unscheduled'
        })
      });
      expect(expandedStory.prop('className')).not.toContain('Story--accepted');
    });
  });
});
