import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryTask from 'components/story/ExpandedStory/ExpandedStoryTask';

describe('<ExpandedStoryTask />', () => {
  const setup = propOverrides => {
    const defaultProps = {
      story: { tasks: [] },
      onDelete: sinon.spy(),
      onUpdate: sinon.spy(),
      onSave: sinon.spy(),
      ...propOverrides
    };

    const wrapper = shallow(<ExpandedStoryTask {...defaultProps} />);
    const wrapperInstance = wrapper.instance();
    const button = wrapper.find('button');
    const input = wrapper.find('input');

    return { wrapper, wrapperInstance, button, input };
  };

  it('renders component title', () => {
    const { wrapper } = setup();

    expect(wrapper.text()).toContain(I18n.t('story.tasks'));
  });

  it('renders component content', () => {
    const { wrapper } = setup();

    expect(wrapper.find('.Story__list-task')).toExist();
    expect(wrapper.find('.Story__task-form')).toExist();
    expect(wrapper.find('.Story__add-task-button')).toExist();
    expect(wrapper.find('.form-control.input-sm')).toExist();
    expect(wrapper.find('TasksList')).toExist();
  });

  describe('onHandleSubmit', () => {
    it('calls onSave with a task', () => {
      const task = 'New Task';
      const onSaveSpy = sinon.spy();
      const { wrapperInstance } = setup({ onSave: onSaveSpy });
      wrapperInstance.setState({ task })

      wrapperInstance.onHandleSubmit();

      expect(onSaveSpy).toHaveBeenCalledWith(task);
    });

    it('calls setState with a empty task', () => {
      const {  wrapperInstance } = setup();

      wrapperInstance.onHandleSubmit();

      expect(wrapperInstance.state.task).toEqual('');
    });
  });
});
