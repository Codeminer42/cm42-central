import React from 'react';
import { fireEvent, render } from '@testing-library/react';
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

    const { container: wrapper } = render(<SelectUser {...defaultProps()} />);
    const select = wrapper.querySelector('select');

    return { wrapper, select };
  };

  it('renders properly', () => {
    const { wrapper } = setup();

    expect(wrapper).toBeInTheDocument();
  });

  it('calls onEdit with the right params', () => {
    const mockOnEdit = vi.fn();
    const value = 1;
    const { select } = setup({ onEdit: mockOnEdit });

    fireEvent.change(select, { target: { value } });

    expect(mockOnEdit).toHaveBeenCalledWith(value.toString());
  });

  describe('Select value', () => {
    it('sets the select value as selectedUserId when selectedUserId is present', () => {
      const selectedUserId = 1;
      const { select } = setup({ selectedUserId });

      fireEvent.change(select, { target: { value: selectedUserId } });

      expect(select.value).toEqual(selectedUserId.toString());
    });

    it(`sets the select value as '' when selectedUserId is not present`, () => {
      const selectedUserId = null;
      const { select } = setup({ selectedUserId });

      fireEvent.change(select, { target: { value: selectedUserId } });

      expect(select.value).toEqual('');
    });
  });

  describe('when component is not disabled', () => {
    it('select field is editable', () => {
      const { select } = setup();

      expect(select.disabled).toBe(false);
    });
  });

  describe('when component is disabled', () => {
    it('select field is disabled', () => {
      const { select } = setup({ disabled: true });

      expect(select.disabled).toBe(true);
    });
  });
});
