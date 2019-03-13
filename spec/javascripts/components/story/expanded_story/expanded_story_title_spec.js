import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryTitle from 'components/story/ExpandedStory/ExpandedStoryTitle';

describe('<ExpandedStoryTitle />', () => {
  const setup = propOverrides => {
    const defaultProps = () => ({
      story: { _editing: { title: 'foo' } },
      onEdit: sinon.spy(),
      ...propOverrides
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
      const story = { _editing: { title: 'bar' } }

      const { input } = setup({ story });

      expect(input.prop('value')).toBe(story._editing.title);
    });

    it('calls onEdit with the right params', () => {
      const mockOnEdit = sinon.spy();
      const eventValue = 'foobar';
      const { input } = setup({ onEdit: mockOnEdit });

      input.simulate('change', { target: { value: eventValue } })

      expect(mockOnEdit).toHaveBeenCalledWith(eventValue);
    });
  });
});
