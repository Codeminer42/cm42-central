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

  it('disables the add task button if text area is empty', ()=>{
    const { input } = setup();
    const { button } = setup();

    input.simulate('change', { target: { value: '' } });
    expect(button.prop('disabled')).toBe(true);
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
