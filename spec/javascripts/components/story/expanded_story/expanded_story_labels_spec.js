import React from 'react';
import { shallow, mount } from 'enzyme';
import ExpandedStoryLabels from 'components/story/ExpandedStory/ExpandedStoryLabels';

describe('<ExpandedStoryLabels />', () => {
  const defaultLabels = [
    { id: 0, name: 'front' },
    { id: 1, name: 'back' }
  ];

  const defaultProps = () => ({
    onAddLabel: sinon.spy(),
    onRemoveLabel: sinon.spy(),
    disabled: false,
    projectLabels: []
  });
  
  const setup = (propOverrides, labelOverrides) => {
    const labels = labelOverrides || defaultLabels;
    const story = { labels, _editing: { labels } };
    const props = {
      ...defaultProps(),
      story,
      ...propOverrides
    };

    const wrapper = shallow(<ExpandedStoryLabels {...props} />);
    const reactTags = wrapper.find('ReactTags');
    const { onRemoveLabel, onAddLabel } = props;

    return { wrapper, reactTags, labels, onRemoveLabel, onAddLabel };
  }

  it('renders component title', () => {
    const story = { _editing: { defaultLabels } }
    const wrapper = mount(
      <ExpandedStoryLabels {...defaultProps()} story={story} />
    );
    
    expect(wrapper.text()).toContain(I18n.t('activerecord.attributes.story.labels'));
  });

  describe('when component is disabled', () => {
    it('does not allow new labels', () => {
      const { wrapper } = setup({ disabled: true });

      expect(wrapper.find('ReactTags').prop('allowNew')).toBe(false);
    });

    it('does not allow deleting labels', () => {
      const { wrapper, onRemoveLabel } = setup({ disabled: true });

      const handleDelete = wrapper.find('ReactTags').prop('handleDelete');

      handleDelete(0);

      expect(onRemoveLabel).not.toHaveBeenCalled();
    });

    describe('when story has no labels', () => {
      it('renders nothing', () => {
        const { wrapper } = setup({ disabled: true }, []);

        expect(wrapper.html()).toBeNull();
      });
    });
  });

  describe('when component is enabled', () => {
    it('allows deleting labels', () => {
      const { wrapper, onRemoveLabel } = setup();

      const handleDelete = wrapper.find('ReactTags').prop('handleDelete');

      handleDelete(0);

      expect(onRemoveLabel).toHaveBeenCalled();
    });

    it('allows adding labels', () => {
      const { reactTags } = setup();

      expect(reactTags.prop('allowNew')).toBe(true);
    });
  });

  describe('<ReactTags />', () => {
    it('renders with the right tags prop', () => {
      const { labels, reactTags } = setup();

      expect(reactTags.prop('tags')).toEqual(labels);
    });
  });
});
