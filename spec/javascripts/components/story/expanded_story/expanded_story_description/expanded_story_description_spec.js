import React from 'react';
import { shallow, mount } from 'enzyme';
import ExpandedStoryDescription from 'components/story/ExpandedStory/ExpandedStoryDescription/index';

describe('<ExpandedStoryDescription />', () => {
  const defaultProps = () => ({
    story: {},
    onEdit: sinon.spy(),
    disabled: false
  });

  it('renders component title', () => {
    const story = { description: null, _editing: { description: null } };

    const wrapper = mount(
      <ExpandedStoryDescription {...defaultProps()} story={story} />
    );

    expect(wrapper.text()).toContain(I18n.t('activerecord.attributes.story.description'));
  });

  describe('when description is null', () => {
    it('renders edit button', () => {
      const story = { description: null, _editing: { description: null } };

      const wrapper = mount(
        <ExpandedStoryDescription {...defaultProps()} story={story} />
      );

      expect(wrapper.text()).toContain(I18n.t('edit'));
    });
  });
});

