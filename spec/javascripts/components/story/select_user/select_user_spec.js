import React from 'react';
import { shallow } from 'enzyme';
import SelectUser from 'components/story/select_user/SelectUser';

describe('<SelectUser />', () => {
  const setup = propOverrides => {
    const defaultProps = {
      users: [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' }
      ],
      userId: 1,
      onEdit: sinon.spy(),
      ...propOverrides
    };

    const wrapper = shallow(<SelectUser {...defaultProps} />);
    const select = wrapper.find('select');

    return { wrapper, select };
  };

  it('renders properly', () => {
    const { wrapper } = setup();

    expect(wrapper).toExist();
  });

  it('calls onEdit with the right params', () => {
    const mockOnEdit = sinon.spy();
    const value = 1;
    const { select } = setup({ onEdit: mockOnEdit });

    select.simulate('change', { target: { value } });

    expect(mockOnEdit).toHaveBeenCalledWith(value);
  });

  describe('Select value', () => {
    it('sets the select value as userId when userId is present', () => {
      const userId = 1;
      const { select } = setup({ userId });

      select.simulate('change', { target: { value: userId } });

      expect(select.props().value).toEqual(userId);
    });

    it(`sets the select value as '' when userId is not present`, () => {
      const userId = null;
      const { select } = setup({ userId });

      select.simulate('change', { target: { value: userId } });

      expect(select.props().value).toEqual('');
    });
  });
});
