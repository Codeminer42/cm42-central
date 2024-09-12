import React from 'react';
import { mount } from 'enzyme';

import TaskForm from 'components/tasks/TaskForm';
import Task from 'models/task';

describe('<TaskForm />', function () {
  let task;

  beforeEach(function () {
    task = new Task({ name: 'Task Test', id: 20 });
  });

  it('should have an onSubmit callback', function () {
    const onSubmit = vi.fn().mockReturnValueOnce(Promise.resolve());
    const wrapper = mount(<TaskForm task={task} onSubmit={onSubmit} />);
    wrapper.find('.add-task').simulate('click');
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should stop loading when save fails', function (done) {
    const onSubmit = vi.fn().mockReturnValueOnce(Promise.reject());
    const wrapper = mount(<TaskForm task={task} onSubmit={onSubmit} />);
    wrapper.find('.add-task').simulate('click');

    Promise.resolve().then(() => {
      wrapper.update();

      expect(wrapper.find('.saving').exists()).toBe(false);
      done();
    });
  });
});
