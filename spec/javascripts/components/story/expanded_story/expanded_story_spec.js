import React from 'react';
import { shallow } from 'enzyme';
import { ExpandedStory } from 'components/story/ExpandedStory/index';
import storyFactory from '../../../support/factories/storyFactory';
import ExpandedStoryRelease from 'components/story/ExpandedStory/ExpandedStoryRelease';
import ExpandedStoryDefault from 'components/story/ExpandedStory/ExpandedStoryDefault';

describe('<ExpandedStory />', () => {
  const defaultProps = () => ({
    story: storyFactory(),
    editStory: sinon.spy(),
    saveStory: sinon.spy(),
    deleteStory: sinon.spy(),
    project: { labels: [] },
    onToggle: sinon.spy()
  });

  describe('when storyType is a release', () => {
    it('renders ExpandedStoryRelease component', () => {
      const story = storyFactory({
        _editing: {
          ...storyFactory(),
          storyType: 'release'
        }
      });

      const wrapper = shallow(
        <ExpandedStory
          {...defaultProps()}
          story={story}
        />,
        { disableLifecycleMethods: true }
      );

      expect(wrapper.find(ExpandedStoryRelease)).toExist();
      expect(wrapper.find(ExpandedStoryDefault)).not.toExist();
    });
  });
  describe("when storyType isn't a release", () => {
    it('renders ExpandedStoryDefault component', () => {
      const story = storyFactory({
        _editing: {
          ...storyFactory(),
          storyType: 'feature'
        }
      });

      const wrapper = shallow(
        <ExpandedStory
          {...defaultProps()}
          story={story}
        />,
        { disableLifecycleMethods: true }
      );

      expect(wrapper.find(ExpandedStoryDefault)).toExist();
      expect(wrapper.find(ExpandedStoryRelease)).not.toExist();
    });
  });

  it('adds loading overlay when updating a story', () => {
    const story = storyFactory({
      _editing: {
        ...storyFactory({ loading: true }),
      }
    });

    const wrapper = shallow(
      <ExpandedStory
        {...defaultProps()}
        story={story}
      />,
      { disableLifecycleMethods: true }
    );

    expect(wrapper.find('div.Story__enable-loading')).toExist();
  })
});
