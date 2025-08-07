import ExpandedStoryTitle from 'components/story/ExpandedStory/ExpandedStoryTitle';
import React from 'react';
import { renderWithProviders } from '../../setupRedux';
import { user } from '../../../support/setup';

describe('<ExpandedStoryTitle />', () => {
  const renderComponent = props => {
    const defaultProps = {
      story: { _editing: { title: 'foo' } },
      onEdit: vi.fn(),
      disabled: false,
    };
    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(<ExpandedStoryTitle {...mergedProps} />);
  };

  it('renders properly', () => {
    const { container } = renderComponent();

    expect(container).toBeInTheDocument();
  });

  describe('input element', () => {
    it('has value equals to story title', () => {
      const props = {
        story: { _editing: { title: 'bar' } },
      };

      const { container } = renderComponent(props);
      const input = container.querySelector('input');

      expect(input.value).toBe(props.story._editing.title);
    });

    it('calls onEdit with the right params', async () => {
      const mockOnEdit = vi.fn();
      const eventValue = '12345';
      const props = {
        onEdit: mockOnEdit,
      };

      const { container } = renderComponent(props);
      const input = container.querySelector('input');

      await user.type(input, eventValue);

      const splitEventValues = eventValue.split('');
      splitEventValues.forEach(value => {
        expect(mockOnEdit).toHaveBeenCalledWith(`foo${value}`);
      });

      expect(mockOnEdit).toHaveBeenCalledTimes(5);
    });

    describe('when the component is enabled', () => {
      it('should not be read-only', () => {
        const props = {
          disabled: false,
        };

        const { container } = renderComponent(props);
        const input = container.querySelector('input');

        expect(input.readOnly).toBe(false);
      });
    });

    describe('when component is disabled', () => {
      it('should be read-only', () => {
        const props = {
          disabled: true,
        };

        const { container } = renderComponent(props);
        const input = container.querySelector('input');

        expect(input.readOnly).toBe(true);
      });
    });
  });
});
