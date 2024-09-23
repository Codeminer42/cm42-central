import React from 'react';
import { render } from '@testing-library/react';
import TasksList from 'components/story/task/TasksList';

describe('<TasksList />', () => {
  const tasksArray = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const setup = propOverrides => {
    const defaultProps = () => ({
      tasks: tasksArray,
      onDelete: vi.fn(),
      onToggle: vi.fn(),
      disabled: false,
      ...propOverrides,
    });

    const { container: wrapper } = render(<TasksList {...defaultProps()} />);

    return { wrapper };
  };

  it('render all tasks in a <Task > component', () => {
    const { wrapper } = setup();

    expect(wrapper.querySelectorAll('.task').length).toBe(tasksArray.length);
  });
});
