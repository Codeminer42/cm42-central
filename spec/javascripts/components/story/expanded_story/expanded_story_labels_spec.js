import { fireEvent, screen } from '@testing-library/react';
import ExpandedStoryLabels from 'components/story/ExpandedStory/ExpandedStoryLabels';
import React from 'react';
import { renderWithProviders } from '../../setupRedux';

describe('<ExpandedStoryLabels />', () => {
  const defaultLabels = [
    { id: 0, name: 'front' },
    { id: 1, name: 'back' },
  ];

  const defaultProps = () => ({
    onAddLabel: vi.fn(),
    onRemoveLabel: vi.fn(),
    disabled: false,
    projectLabels: [],
  });

  const setup = (propOverrides, labelOverrides) => {
    const labels = labelOverrides || defaultLabels;
    const story = { labels, _editing: { labels } };
    const props = {
      ...defaultProps(),
      story,
      ...propOverrides,
    };

    const wrapper = renderWithProviders(
      <ExpandedStoryLabels {...props} />
    ).container;
    const reactTags = wrapper.firstChild;
    const { onRemoveLabel, onAddLabel } = props;

    return { wrapper, reactTags, labels, onRemoveLabel, onAddLabel };
  };

  it('renders component title', () => {
    const props = {
      ...defaultProps(),
      story: { _editing: { defaultLabels } },
    };

    renderWithProviders(<ExpandedStoryLabels {...props} />);

    const labelsText = screen.getByText(
      I18n.t('activerecord.attributes.story.labels')
    );

    expect(labelsText).toBeInTheDocument();
  });

  describe('when component is disabled', () => {
    it('does not allow new labels', () => {
      setup({ disabled: true });
      const addLabel = screen.queryByText(I18n.t('add new label'));

      expect(addLabel).toBeNull();
    });

    it('does not allow deleting labels', () => {
      const { wrapper, onRemoveLabel } = setup({ disabled: true });

      const deleteButton = wrapper.querySelector('.react-tags__selected-tag');
      fireEvent.click(deleteButton);

      expect(onRemoveLabel).not.toHaveBeenCalled();
    });

    describe('when story has no labels', () => {
      it('renders nothing', () => {
        const { wrapper } = setup({ disabled: true }, []);

        expect(wrapper.innerHTML).toBe('');
      });
    });
  });

  describe('when component is enabled', () => {
    it('allows deleting labels', () => {
      const { wrapper, onRemoveLabel } = setup();
      const deleteButton = wrapper.querySelector('.react-tags__selected-tag');

      fireEvent.click(deleteButton);

      expect(onRemoveLabel).toHaveBeenCalled();
    });

    it('allows adding labels', () => {
      setup();
      const addLabel = screen.queryByText(I18n.t('add new label'));

      expect(addLabel).toBeInTheDocument();
    });
  });

  describe('<ReactTags />', () => {
    it('renders with the right tags prop', () => {
      const { wrapper, labels } = setup();
      const renderedLabelElements = wrapper.querySelectorAll(
        '.react-tags__selected-tag-name'
      );
      const renderedLabelNames = Array.from(renderedLabelElements).map(
        label => label.innerHTML
      );

      expect(renderedLabelNames).toEqual(labels.map(label => label.name));
    });
  });
});
