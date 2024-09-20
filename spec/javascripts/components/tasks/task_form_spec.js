import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import TaskForm from 'components/tasks/TaskForm';
import Task from 'models/task';

describe('<TaskForm />', function () {
  let task;

  beforeEach(function () {
    task = new Task({ name: 'Task Test', id: 20 });
  });

  it('should have an onSubmit callback', function () {
    const onSubmit = vi.fn().mockReturnValueOnce(Promise.resolve());
    const { getByRole } = render(<TaskForm task={task} onSubmit={onSubmit} />);

    const button = getByRole('button');
    fireEvent.click(button);

    expect(onSubmit).toHaveBeenCalled();
  });

  it('should stop loading when save fails', async function (done) {
    const onSubmit = vi.fn().mockReturnValueOnce(Promise.reject());
    const { getByRole } = render(<TaskForm task={task} onSubmit={onSubmit} />);

    const button = getByRole('button');
    fireEvent.click(button);

    Promise.resolve().then(() => {
      expect(button).not.toHaveClass('saving');
    });
  });
});
