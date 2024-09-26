import { fireEvent, screen } from '@testing-library/react';
import ExpandedStoryTask from 'components/story/ExpandedStory/ExpandedStoryTask';
import React from 'react';
import storyFactory from '../../../support/factories/storyFactory';
import { renderWithProviders } from '../../setupRedux';

describe('<ExpandedStoryTask />', () => {
  const renderComponent = props => {
    const defaultProps = {
      story: {
        ...storyFactory({
          tasks: [],
          _editing: storyFactory({ tasks: [] }),
        }),
      },
      onDelete: vi.fn(),
      onToggle: vi.fn(),
      onSave: vi.fn(),
      disabled: false,
    };

    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(<ExpandedStoryTask {...mergedProps} />);
  };

  it('renders component title', () => {
    renderComponent();
    const title = screen.getByText(I18n.t('story.tasks'));

    expect(title).toBeInTheDocument();
  });

  describe('when component is enabled', () => {
    it('displays a task form', () => {
      const { container } = renderComponent();
      const taskForm = container.querySelector('.task-form');

      expect(taskForm).toBeInTheDocument();
    });

    it('disables the add task button if text area is empty', () => {
      const { container } = renderComponent();
      const input = container.querySelector('input');
      const button = container.querySelector('button');
      fireEvent.change(input, { target: { value: '' } });

      expect(button).toBeDisabled();
    });

    describe('onHandleSubmit', () => {
      it('calls onSave with a task', () => {
        const task = 'New Task';
        const onSaveSpy = vi.fn();
        const props = { onSave: onSaveSpy };
        const event = { target: { value: task } };

        const { container } = renderComponent(props);
        const input = container.querySelector('input');
        const button = container.querySelector('button');
        fireEvent.change(input, event);
        fireEvent.click(button);

        expect(onSaveSpy).toHaveBeenCalledTimes(1);
        expect(onSaveSpy).toHaveBeenCalledWith(task);
      });
    });
  });

  describe('when component is disabled', () => {
    const task = {
      id: 0,
      storyId: 0,
      name: 'task',
      done: false,
      createdAt: '2019/04/01',
      updatedAt: '2019/04/02',
    };

    it('does not display task form', () => {
      const props = {
        story: {
          ...storyFactory({ tasks: [task] }),
          _editing: storyFactory({ tasks: [task] }),
        },
        disabled: true,
      };

      const { container } = renderComponent(props);
      const taskForm = container.querySelector('.task-form');

      expect(taskForm).toBeNull();
    });

    describe('when there are no tasks', () => {
      it('renders nothing', () => {
        const props = {
          disabled: true,
        };

        const { container } = renderComponent(props);

        expect(container.innerHTML).toBe('');
      });
    });
  });
});
