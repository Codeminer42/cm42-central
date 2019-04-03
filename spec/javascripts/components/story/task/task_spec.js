import React from 'react';
import { shallow } from 'enzyme';
import Task from 'components/story/task/Task';

describe('<Task />', () => {
  const setup = propOverrides => {
    const defaultProps = () => ({
      task: {
        id: 1,
        name: 'Foo',
        done: false,
        createdAt: '20/06/2018'
      },
      onDelete: sinon.spy(),
      onToggle: sinon.spy(),
      disabled: false,
      ...propOverrides
    });

    const wrapper = shallow(<Task {...defaultProps()} />);
    const span = wrapper.find('.delete-btn');
    const label = wrapper.find('label');
    const checkbox = wrapper.find('input');

    return { wrapper, span, label, checkbox };
  };

  describe('when user deletes a task', () => {
    it('triggers onDelete callback', () => {
      const onDeleteSpy = sinon.spy();
      const { span } = setup({ onDelete: onDeleteSpy })

      span.simulate('click');

      expect(onDeleteSpy).toHaveBeenCalled();
    });
  });

  describe('when user update status of the task clicking on checkbox', () => {
    it('triggers onToggle callback', () => {
      const onToggleCheckedBoxSpy = sinon.spy();
      const { checkbox } = setup({ onToggle: onToggleCheckedBoxSpy });

      checkbox.simulate('click');

      expect(onToggleCheckedBoxSpy).toHaveBeenCalled();
    });
  });

  describe('when task is read-only', () => {
    it('does not render a Delete span', () => {
      const { span } = setup({ disabled: true });
      
      expect(span.exists()).toBe(false);
    });

    describe('when user tries to update the task clicking on checkbox', () => {
      it('does not trigger onToggle callback', () => {
        const onToggleCheckedBoxSpy = sinon.spy();
        const { checkbox } = setup({ disabled: true });
  
        checkbox.simulate('click');
  
        expect(onToggleCheckedBoxSpy).not.toHaveBeenCalled();
      });
    });
  });
});

