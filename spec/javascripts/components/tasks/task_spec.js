import React from 'react';
import { render } from '@testing-library/react';

import TaskComponent from 'components/tasks/Task';
import Task from 'models/task';
import { user } from '../../support/setup';

describe('<Task />', function () {
  let task;

  beforeEach(function () {
    task = new Task({ name: 'Test Task', id: 5 });
  });

  it('should be able to call handleDelete', async function () {
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
    await user.click(button);

    expect(handleDelete).toHaveBeenCalled();
  });

  it('should be able to call handleUpdate', async function () {
    const handleUpdate = vi.fn();
    const { getByRole } = render(
      <TaskComponent task={task} disabled={false} handleUpdate={handleUpdate} />
    );

    const input = getByRole('checkbox');
    await user.click(input);

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
