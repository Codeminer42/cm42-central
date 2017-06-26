import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { mount } from 'enzyme';

import TaskForm from 'components/tasks/TaskForm';
import Task from 'models/task.js';

describe('<TaskForm />', function() {
  let task;

  beforeEach(function() {
    jasmineEnzyme();
    task = new Task({name: 'Task Test', id: 20});
    sinon.stub(I18n, 't');
    sinon.stub(task, 'save');
  });

  afterEach(function() {
    I18n.t.restore();
    task.save.restore();
  });

  it("should have an onSubmit callback", function() {
    const onSubmit = sinon.stub().returns($.Deferred());
    const wrapper = mount(
      <TaskForm
        task={task}
        onSubmit={onSubmit}
      />
    );
    wrapper.find('.add-task').simulate('click');
    expect(onSubmit).toHaveBeenCalled();
  });

  it("should stop loading  when save fails", function() {
    const onSubmit = sinon.stub().returns($.Deferred().reject());
    const wrapper = mount(
      <TaskForm
        task={task}
        onSubmit={onSubmit}
      />
    );
    wrapper.find('.add-task').simulate('click');
    return $.Deferred().resolve().then(() =>
      expect(wrapper).toHaveState('loading', false)
    );
  });

});
