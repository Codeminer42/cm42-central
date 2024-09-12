import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryType from 'components/story/ExpandedStory/ExpandedStoryType';
import { types } from 'models/beta/story';

describe('<ExpandedStoryType />', () => {
  const setup = propOverrides => {
    const defaultProps = {
      onEdit: vi.fn(),
      story: { _editing: { storyType: 'feature' } },
      disabled: false,
      ...propOverrides,
    };
    const wrapper = shallow(<ExpandedStoryType {...defaultProps} />);
    const select = wrapper.find('select');

    return { wrapper, select };
  };

  types.forEach(type => {
    it(`sets defaultValue as ${type} in select`, () => {
      const story = { _editing: { storyType: type } };
      const { select } = setup({ story });

      expect(select.prop('value')).toBe(type);
    });
  });

  describe('when component is not disabled', () => {
    it('select field is editable', () => {
      const { select } = setup();

      expect(select.prop('disabled')).toBe(false);
    });
  });

  describe('when component is disabled', () => {
    it('select field is disabled', () => {
      const { select } = setup({ disabled: true });

      expect(select.prop('disabled')).toBe(true);
    });
  });
});
