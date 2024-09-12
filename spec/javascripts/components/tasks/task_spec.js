import React from 'react';
import { shallow, mount } from 'enzyme';

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
    const wrapper = mount(
      <TaskComponent task={task} disabled={false} handleDelete={handleDelete} />
    );

    wrapper.find('.delete-btn').simulate('click');
    expect(handleDelete).toHaveBeenCalled();
  });

  it('should be able to call handleUpdate', function () {
    const handleUpdate = vi.fn();
    const wrapper = mount(
      <TaskComponent task={task} disabled={false} handleUpdate={handleUpdate} />
    );

    wrapper.find('input').simulate('change', { target: { checked: true } });
    expect(handleUpdate).toHaveBeenCalled();
  });

  describe('when not disabled', function () {
    it('should have an delete button', function () {
      const wrapper = mount(<TaskComponent task={task} disabled={false} />);
      expect(wrapper.find('.delete-btn')).toExist();
    });
  });

  describe('when disabled', function () {
    it('should not have a delete button', function () {
      const wrapper = mount(<TaskComponent task={task} disabled={true} />);
      expect(wrapper.find('.delete-btn')).not.toExist();
    });
  });
});
