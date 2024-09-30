import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Task from 'components/story/task/Task';

describe('<Task />', () => {
  const setup = propOverrides => {
    const defaultProps = () => ({
      task: {
        id: 1,
        name: 'Foo',
        done: false,
        createdAt: '20/06/2018',
      },
      onDelete: vi.fn(),
      onToggle: vi.fn(),
      disabled: false,
      ...propOverrides,
    });

    const { container: wrapper } = render(<Task {...defaultProps()} />);
    const deleteLink = wrapper.querySelector('.delete-btn');
    const label = wrapper.querySelector('label');
    const checkbox = wrapper.querySelector('input');

    return { wrapper, deleteLink, label, checkbox };
  };

  describe('when user deletes a task', () => {
    it('triggers onDelete callback', () => {
      const onDeleteSpy = vi.fn();
      const { deleteLink } = setup({ onDelete: onDeleteSpy });

      fireEvent.click(deleteLink);

      expect(onDeleteSpy).toHaveBeenCalled();
    });
  });

  describe('when user update status of the task clicking on checkbox', () => {
    it('triggers onToggle callback', () => {
      const onToggleCheckedBoxSpy = vi.fn();
      const { checkbox } = setup({ onToggle: onToggleCheckedBoxSpy });

      fireEvent.click(checkbox);

      expect(onToggleCheckedBoxSpy).toHaveBeenCalled();
    });
  });

  describe('when task is read-only', () => {
    it('does not render a link to delete task', () => {
      const { deleteLink } = setup({ disabled: true });

      expect(deleteLink).not.toBeInTheDocument();
    });

    describe('when user tries to update the task clicking on checkbox', () => {
      it('does not trigger onToggle callback', () => {
        const onToggleCheckedBoxSpy = vi.fn();
        const { checkbox } = setup({ disabled: true });

        fireEvent.click(checkbox);

        expect(onToggleCheckedBoxSpy).not.toHaveBeenCalled();
      });
    });
  });
});
