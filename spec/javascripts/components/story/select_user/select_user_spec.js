import React from 'react';
import { shallow } from 'enzyme';
import SelectUser from 'components/story/select_user/SelectUser';

describe('<SelectUser />', () => {
  const setup = propOverrides => {
    const defaultProps = () => ({
      users: [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' },
      ],
      selectedUserId: 1,
      onEdit: vi.fn(),
      disabled: false,
      ...propOverrides,
    });

    const wrapper = shallow(<SelectUser {...defaultProps()} />);
    const select = wrapper.find('select');

    return { wrapper, select };
  };

  it('renders properly', () => {
    const { wrapper } = setup();

    expect(wrapper).toExist();
  });

  it('calls onEdit with the right params', () => {
    const mockOnEdit = vi.fn();
    const value = 1;
    const { select } = setup({ onEdit: mockOnEdit });

    select.simulate('change', { target: { value } });

    expect(mockOnEdit).toHaveBeenCalledWith(value);
  });

  describe('Select value', () => {
    it('sets the select value as selectedUserId when selectedUserId is present', () => {
      const selectedUserId = 1;
      const { select } = setup({ selectedUserId });

      select.simulate('change', { target: { value: selectedUserId } });

      expect(select.props().value).toEqual(selectedUserId);
    });

    it(`sets the select value as '' when selectedUserId is not present`, () => {
      const selectedUserId = null;
      const { select } = setup({ selectedUserId });

      select.simulate('change', { target: { value: selectedUserId } });

      expect(select.props().value).toEqual('');
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
