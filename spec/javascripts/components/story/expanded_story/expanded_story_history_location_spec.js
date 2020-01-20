import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryHistoryLocation from 'components/story/ExpandedStory/ExpandedStoryHistoryLocation';
import storyFactory from '../../../support/factories/storyFactory';
import { storyTypes } from 'libs/beta/constants';

describe('<ExpandedStoryHistoryLocation />', () => {
  const defaultProps = () => ({
    onClone: sinon.spy(),
    showHistory: sinon.spy(),
    story: {
      ...storyFactory(),
      _editing: storyFactory()
    },
  });

  describe('when user click on clone story', () => {
    it('calls onClone callback', () => {
      const onClone = sinon.spy();

      const wrapper = shallow(
        <ExpandedStoryHistoryLocation {...defaultProps()} onClone={onClone} />
      );

      wrapper.find('.clone-story').simulate('click');

      expect(onClone).toHaveBeenCalled();
    });
  });

  describe('story link', () => {
    it('renders an input with the right story link', () => {
      const story = storyFactory({
        id: 42,
        _editing: storyFactory()
      });

      const wrapper = shallow(
        <ExpandedStoryHistoryLocation {...defaultProps()} story={story} />
      );

      const storyInput = wrapper.find('input');

      expect(storyInput.prop('value')).toContain(`#story-${story.id}`);
    });
  });

  describe('copy id to clipboard', () => {
    it('renders a clipboard component with the right story id', () => {
      const story = storyFactory({ id: 42, _editing: storyFactory() });

      const wrapper = shallow(
        <ExpandedStoryHistoryLocation {...defaultProps()} story={story} />
      );

      const copyIdButton = wrapper.find(`[data-clipboard-text="#${story.id}"]`);

      expect(copyIdButton.exists()).toBe(true);
    })
  });

  describe('when story is release', () => {
    it('doest not render history button', () => {
      const story = storyFactory({ storyType: storyTypes.RELEASE, _editing: storyFactory() });

      const wrapper = shallow(
        <ExpandedStoryHistoryLocation {...defaultProps()} story={story} />
      );

      const historyButton = wrapper.find('[data-id="history-button"]');

      expect(historyButton).not.toExist();
    })
  });

  const noReleasesTypes = [storyTypes.FEATURE, storyTypes.BUG, storyTypes.CHORE];

  noReleasesTypes.forEach(storyType => {
    describe(`when story is ${storyType}`, () => {
      it('renders history button', () => {
        const story = storyFactory({ storyType, _editing: storyFactory() });

        const wrapper = shallow(
          <ExpandedStoryHistoryLocation {...defaultProps()} story={story} />
        );
  
        const historyButton = wrapper.find('[data-id="history-button"]');
  
        expect(historyButton).toExist();
      });
    });
  })
});
