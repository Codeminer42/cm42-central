import React from 'react';
import { shallow } from 'enzyme';
import { ExpandedStory } from 'components/story/ExpandedStory/index';
import storyFactory from '../../../support/factories/storyFactory';
import ExpandedStoryRelease from 'components/story/ExpandedStory/ExpandedStoryRelease';
import ExpandedStoryDefault from 'components/story/ExpandedStory/ExpandedStoryDefault';

describe('<ExpandedStory />', () => {
  const defaultProps = () => ({
    story: storyFactory(),
    editStory: vi.fn(),
    saveStory: vi.fn(),
    deleteStory: vi.fn(),
    project: { labels: [] },
    disabled: false,
    onToggle: vi.fn(),
    cloneStory: vi.fn(),
    showHistory: vi.fn(),
    onClone: vi.fn(),
  });

  describe('when storyType is a release', () => {
    it('renders ExpandedStoryRelease component', () => {
      const story = storyFactory({
        _editing: {
          ...storyFactory(),
          storyType: 'release',
        },
      });

      const wrapper = shallow(
        <ExpandedStory {...defaultProps()} story={story} />,
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
          storyType: 'feature',
        },
      });

      const wrapper = shallow(
        <ExpandedStory {...defaultProps()} story={story} />,
        { disableLifecycleMethods: true }
      );

      expect(wrapper.find(ExpandedStoryDefault)).toExist();
      expect(wrapper.find(ExpandedStoryRelease)).not.toExist();
    });
  });

  describe('when story is editable', () => {
    const story = storyFactory({
      _editing: {
        ...storyFactory(),
        storyType: 'feature',
        state: 'unstarted',
      },
    });

    it('passes disabled prop as false', () => {
      const wrapper = shallow(
        <ExpandedStory {...defaultProps()} story={story} />,
        { disableLifecycleMethods: true }
      );
      const expandedStoryDefault = wrapper.find(ExpandedStoryDefault);

      expect(expandedStoryDefault.prop('disabled')).toBe(false);
    });
  });

  describe('when story is not editable', () => {
    const story = storyFactory({
      _editing: {
        ...storyFactory(),
        storyType: 'feature',
        state: 'accepted',
      },
      storyType: 'feature',
      state: 'accepted',
    });

    it('passes disabled prop as true', () => {
      const wrapper = shallow(
        <ExpandedStory {...defaultProps()} story={story} />,
        { disableLifecycleMethods: true }
      );
      const expandedStoryDefault = wrapper.find(ExpandedStoryDefault);

      expect(expandedStoryDefault.prop('disabled')).toBe(true);
    });
  });

  it('adds enable-loading className when updating a story', () => {
    const story = storyFactory({
      _editing: {
        ...storyFactory({ loading: true }),
      },
    });

    const wrapper = shallow(
      <ExpandedStory {...defaultProps()} story={story} className="" />,
      { disableLifecycleMethods: true }
    );

    expect(wrapper.find('.Story__enable-loading')).toExist();
  });
});
