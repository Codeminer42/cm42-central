import ExpandedStoryType from 'components/story/ExpandedStory/ExpandedStoryType';
import { types } from 'models/beta/story';
import React from 'react';
import { renderWithProviders } from '../../setupRedux';

describe('<ExpandedStoryType />', () => {
  const renderComponent = props => {
    const defaultProps = {
      onEdit: vi.fn(),
      story: { _editing: { storyType: 'feature' } },
      disabled: false,
    };

    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(<ExpandedStoryType {...mergedProps} />);
  };

  types.forEach(type => {
    it(`sets defaultValue as ${type} in select`, () => {
      const props = {
        story: { _editing: { storyType: type } },
      };

      const { container } = renderComponent(props);
      const select = container.querySelector('select');

      expect(select.value).toBe(type);
    });
  });

  describe('when component is not disabled', () => {
    it('select field is editable', () => {
      const { container } = renderComponent();
      const select = container.querySelector('select');

      expect(select).toBeInTheDocument();
      expect(select).not.toBeDisabled();
    });
  });

  describe('when component is disabled', () => {
    it('select field is disabled', () => {
      const { container } = renderComponent({ disabled: true });
      const select = container.querySelector('select');

      expect(select).toBeDisabled();
    });
  });
});
