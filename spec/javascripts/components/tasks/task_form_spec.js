import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { mount } from 'enzyme';

import TaskForm from 'components/tasks/TaskForm';
import Task from 'models/task';

describe('<TaskForm />', () => {
  let task;

  beforeEach(() => {
    jasmineEnzyme();
    task = new Task({ name: 'Task Test', id: 20 });
    sinon.stub(I18n, 't');
    sinon.stub(task, 'save');
  });

  afterEach(() => {
    I18n.t.restore();
    task.save.restore();
  });

  it('should have an onSubmit callback', () => {
    const onSubmit = sinon.stub().returns($.Deferred());
    const wrapper = mount(<TaskForm
      task={task}
      onSubmit={onSubmit}
    />);
    wrapper.find('.add-task').simulate('click');
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should stop loading when save fails', () => {
    const onSubmit = sinon.stub().returns($.Deferred().reject());
    const wrapper = mount(<TaskForm
      task={task}
      onSubmit={onSubmit}
    />);
    wrapper.find('.add-task').simulate('click');
    return $.Deferred().resolve().then(() =>
      expect(wrapper.find('.saving')).toHaveLength(0));
  });
});
