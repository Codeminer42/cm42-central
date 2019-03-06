import React from 'react';
import { shallow } from 'enzyme';
import TasksList from 'components/story/task/TasksList';

describe('<TasksList />', () => {
  const tasksArray = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const setup = propOverrides => {
    const defaultProps = () => ({
      tasks: tasksArray,
      onDelete: sinon.spy(),
      onToggle: sinon.spy(),
      ...propOverrides
    });

    const wrapper = shallow(<TasksList {...defaultProps()} />);

    return { wrapper };
  };

  it('render all tasks in a <Task > component', () => {
    const { wrapper } = setup();

    expect(wrapper.find('Task').length).toBe(tasksArray.length);
  });
});
