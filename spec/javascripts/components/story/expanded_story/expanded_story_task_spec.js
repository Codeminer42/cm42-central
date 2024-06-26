import React from 'react';
import { mount } from 'enzyme';
import ExpandedStoryTask from 'components/story/ExpandedStory/ExpandedStoryTask';
import storyFactory from '../../../support/factories/storyFactory';

describe('<ExpandedStoryTask />', () => {
  const setup = (propOverrides, tasks) => {
    const defaultProps = () => ({
      story: {
        ...storyFactory({
          tasks: tasks || [],
          _editing: storyFactory({ tasks: tasks || [] })
        })
      },
      onDelete: sinon.spy(),
      onToggle: sinon.spy(),
      onSave: sinon.spy(),
      disabled: false,
      ...propOverrides
    });

    const wrapper = mount(<ExpandedStoryTask {...defaultProps()} />);
    const button = wrapper.find('button');
    const input = wrapper.find('input');

    return { wrapper, button, input };
  };

  it('renders component title', () => {
    const { wrapper } = setup();

    expect(wrapper.text()).toContain(I18n.t('story.tasks'));
  });

  describe('when component is enabled', () => {
    it('displays a task form', () => {
      const { wrapper } = setup();

      expect(wrapper.exists('.task-form')).toBe(true);
    });

    it('disables the add task button if text area is empty', () => {
      const { input, button } = setup();
  
      input.simulate('change', { target: { value: '' } });
      expect(button.prop('disabled')).toBe(true);
    });
  
    describe('onHandleSubmit', () => {
      it('calls onSave with a task', () => {
        const task = 'New Task';
        const onSaveSpy = sinon.spy();
        const event = { target: { value: task } };
        const { input, button } = setup({ onSave: onSaveSpy });
        
        input.simulate('change', event);
        button.simulate('click');
  
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
      createdAt: "2019/04/01",
      updatedAt: "2019/04/02"
    };

    it('does not display task form', () => {
      const { wrapper } = setup({ disabled: true }, [task]);

      expect(wrapper.exists('.task-form')).toBe(false);
    });

    describe('when there are no tasks', () => {
      it('renders nothing', () => {
        const { wrapper } = setup({ disabled: true });
  
        expect(wrapper.html()).toBeNull();
      });
    });
  });
});
