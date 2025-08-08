import React from 'react';
import { render, waitFor } from '@testing-library/react';

import TaskForm from 'components/tasks/TaskForm';
import Task from 'models/task';
import { user } from '../../support/setup';

describe('<TaskForm />', function () {
  let task;

  beforeEach(function () {
    task = new Task({ name: 'Task Test', id: 20 });
  });

  it('should have an onSubmit callback', async function () {
    const onSubmit = vi.fn().mockReturnValueOnce(Promise.resolve());
    const { getByRole } = render(<TaskForm task={task} onSubmit={onSubmit} />);

    const button = getByRole('button');

    await user.click(button);

    expect(onSubmit).toHaveBeenCalled();
  });

  it('should stop loading when save fails', async function () {
    const onSubmit = vi
      .fn()
      .mockImplementation(() => Promise.reject(new Error('Save failed')));
    const { getByRole } = render(<TaskForm task={task} onSubmit={onSubmit} />);

    const button = getByRole('button');

    await user.click(button);

    await waitFor(() => {
      expect(button).not.toHaveClass('saving');
    });
  });
});
