import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import Checkbox from 'components/forms/Checkbox';
import TaskComponent from 'components/tasks/Task';
import TaskForm from 'components/tasks/TaskForm';
import Task from 'models/task';

describe('<Task />', function () {
  let task;

  beforeEach(function () {
    task = new Task({ name: 'Test Task', id: 5 });
  });

  it('should be able to call handleDelete', function () {
    const handleDelete = vi.fn();
    const { container } = render(
      <TaskComponent
        task={task}
        disabled={false}
        handleDelete={handleDelete}
        handleUpdate={() => {}}
      />
    );

    const button = container.querySelector('.delete-btn');
    fireEvent.click(button);

    expect(handleDelete).toHaveBeenCalled();
  });

  it('should be able to call handleUpdate', async function () {
    const handleUpdate = vi.fn();
    const { getByRole } = render(
      <TaskComponent task={task} disabled={false} handleUpdate={handleUpdate} />
    );

    const input = getByRole('checkbox');
    fireEvent.click(input);

    expect(handleUpdate).toHaveBeenCalled();
  });

  describe('when not disabled', function () {
    it('should have an delete button', function () {
      const { container } = render(
        <TaskComponent task={task} disabled={false} />
      );
      expect(container.querySelector('.delete-btn')).toBeInTheDocument();
    });
  });

  describe('when disabled', function () {
    it('should not have a delete button', function () {
      const { container } = render(
        <TaskComponent task={task} disabled={true} />
      );
      expect(container.querySelector('.delete-btn')).not.toBeInTheDocument();
    });
  });
});
