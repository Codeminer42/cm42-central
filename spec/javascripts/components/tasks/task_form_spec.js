import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react';

import TaskForm from 'components/tasks/TaskForm';
import Task from 'models/task';

describe('<TaskForm />', function () {
  let task;

  beforeEach(function () {
    task = new Task({ name: 'Task Test', id: 20 });
  });

  it('should have an onSubmit callback', async function () {
    const onSubmit = vi.fn().mockReturnValueOnce(Promise.resolve());
    const { getByRole } = render(<TaskForm task={task} onSubmit={onSubmit} />);

    const button = getByRole('button');

    await act(async () => {
      fireEvent.click(button);
    });

    expect(onSubmit).toHaveBeenCalled();
  });

  it('should stop loading when save fails', async function () {
    const onSubmit = vi.fn().mockReturnValueOnce(Promise.reject());
    const { getByRole } = render(<TaskForm task={task} onSubmit={onSubmit} />);

    const button = getByRole('button');

    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(button).not.toHaveClass('saving');
    });
  });
});
