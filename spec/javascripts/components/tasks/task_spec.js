
import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import { shallow, mount } from 'enzyme';

import Checkbox from 'components/forms/Checkbox';
import TaskComponent from 'components/tasks/Task';
import TaskForm from 'components/tasks/TaskForm';
import Task from 'models/task';

describe('<Task />', () => {
  let task;

  beforeEach(() => {
    jasmineEnzyme();
    sinon.stub(I18n, 't');
    task = new Task({ name: 'Test Task', id: 5 });
  });

  afterEach(() => {
    I18n.t.restore();
  });

  it('should be able to call handleDelete', () => {
    const handleDelete = sinon.stub();
    const wrapper = mount(<TaskComponent
      task={task}
      disabled={false}
      handleDelete={handleDelete}
    />);

    wrapper.find('.delete-btn').simulate('click');
    expect(handleDelete).toHaveBeenCalled();
  });

  it('should be able to call handleUpdate', () => {
    const handleUpdate = sinon.stub();
    const wrapper = mount(<TaskComponent
      task={task}
      disabled={false}
      handleUpdate={handleUpdate}
    />);

    wrapper.find('input').simulate('change', { target: { checked: true } });
    expect(handleUpdate).toHaveBeenCalled();
  });

  describe('when not disabled', () => {
    it('should have an delete button', () => {
      const wrapper = mount(<TaskComponent task={task} disabled={false} />);
      expect(wrapper.find('.delete-btn')).toBePresent();
    });
  });

  describe('when disabled', () => {
    it('should not have a delete button', () => {
      const wrapper = mount(<TaskComponent task={task} disabled />);
      expect(wrapper.find('.delete-btn')).not.toBePresent();
    });
  });
});
