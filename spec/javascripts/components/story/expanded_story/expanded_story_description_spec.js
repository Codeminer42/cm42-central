import React from 'react';
import { shallow, mount } from 'enzyme';
import ExpandedStoryDescription from 'components/story/ExpandedStory/ExpandedStoryDescription';

describe('<ExpandedStoryDescription />', () => {
  const defaultProps = () => ({
    story: {},
    onEdit: sinon.spy(),
    disabled: false
  });

  const renderTextarea = propOverrides => {
    const story = {
      description: 'story description',
      _editing: { description: 'story description' }
    };
    const props = { ...defaultProps(), ...propOverrides }
    const wrapper = shallow(
      <ExpandedStoryDescription {...props} story={story} />
    );
    const content = wrapper.find('.story-description-content');
    content.simulate('click');

    const textarea = wrapper.find('[data-id="text-area"]');

    return { textarea, wrapper, story }
  }

  it('renders component title', () => {
    const story = { description: null, _editing: { description: null } };

    const wrapper = mount(
      <ExpandedStoryDescription {...defaultProps()} story={story} />
    );

    expect(wrapper.text()).toContain(I18n.t('activerecord.attributes.story.description'));
  });

  describe("when description isn't null", () => {
    it('renders markdown with the story description', () => {
      const story = {
        description: 'story description',
        _editing: { description: 'story description' }
      };

      const wrapper = shallow(
        <ExpandedStoryDescription {...defaultProps()} story={story} />
      );
      const markdown = wrapper.find('Markdown');

      expect(markdown.prop('source')).toBe(story.description);
    });
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

  describe('toggleField', () => {
    it('change editing state from false to true', () => {
      const story = { description: null, _editing: { description: null } };

      const wrapper = shallow(
        <ExpandedStoryDescription {...defaultProps()} story={story} />
      );
      const content = wrapper.find('.story-description-content');

      expect(wrapper.state().editing).toBe(false);
      content.simulate('click');
      expect(wrapper.state().editing).toBe(true);
    });

    it('change to a textarea with value story description', () => {
      const { textarea, story } = renderTextarea();

      expect(textarea.prop('value')).toBe(story._editing.description);
    });
  });

  describe('when component is enabled', () => {
    describe('textarea', () => {
      it('is editable', () => {
        const { textarea } = renderTextarea();

        expect(textarea.prop('readOnly')).toBe(false);
      });
    });

    describe('onEdit', () => {
      it('calls onEdit with story description on textarea change', () => {
        const onEdit = sinon.spy();
        const { textarea, story } = renderTextarea({ onEdit });
        const change = `${story._editing.description} changed`;

        textarea.simulate('change', { target: { value: change } });

        expect(onEdit).toHaveBeenCalledWith(change);
      });
    });
  });

  describe('when component is disabled', () => {
    it('does not allow editing', () => {
      const { textarea } = renderTextarea({ disabled: true });

      expect(textarea.prop('readOnly')).toBe(true);
    });

    describe('when story has no description', () => {
      it('renders nothing', () => {
        const story = { description: null, _editing: { description: null } };

        const wrapper = shallow(
          <ExpandedStoryDescription {...defaultProps()} disabled={true} story={story} />
        );

        expect(wrapper.html()).toBeNull();
      });
    });
  });
});

