import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryTitle from 'components/story/ExpandedStory/ExpandedStoryTitle';

describe('<ExpandedStoryTitle />', () => {
  const setup = propOverrides => {
    const defaultProps = () => ({
      story: { _editing: { title: 'foo' } },
      onEdit: vi.fn(),
      disabled: false,
      ...propOverrides,
    });

    const wrapper = shallow(<ExpandedStoryTitle {...defaultProps()} />);
    const input = wrapper.find('input');

    return { wrapper, input };
  };

  it('renders properly', () => {
    const { wrapper } = setup();

    expect(wrapper).toExist();
  });

  describe('input element', () => {
    it('has value equals to story title', () => {
      const story = { _editing: { title: 'bar' } };

      const { input } = setup({ story });

      expect(input.prop('value')).toBe(story._editing.title);
    });

    it('calls onEdit with the right params', () => {
      const mockOnEdit = vi.fn();
      const eventValue = 'foobar';
      const { input } = setup({ onEdit: mockOnEdit });

      input.simulate('change', { target: { value: eventValue } });

      expect(mockOnEdit).toHaveBeenCalledWith(eventValue);
    });

    describe('when the component is enabled', () => {
      it('should not be read-only', () => {
        const { input } = setup({ disabled: false });

        expect(input.prop('readOnly')).toBe(false);
      });
    });

    describe('when component is disabled', () => {
      it('should be read-only', () => {
        const { input } = setup({ disabled: true });

        expect(input.prop('readOnly')).toBe(true);
      });
    });
  });
});
