import React from 'react';
import { shallow } from 'enzyme';
import Note from 'components/story/note/Note';

describe('<Note/>', () => {
  const note = {
    id: 42,
    note: 'test Note',
    userName: 'foo',
    createdAt: '27/08/2018'
  };

  const setup = propOverrides => {
    const onDeleteSpy = sinon.spy();
  
    const wrapper = shallow(
      <Note
        note={note}
        onDelete={onDeleteSpy}
        disabled={false}
        {...propOverrides}
      />
    );

    const button = wrapper.find('.delete-note-button');

    return { wrapper, button, onDeleteSpy };
  };

  describe('when component is enabled', () => {
    it('allows editing', () => {
      const { button } = setup();

      expect(button.exists()).toBe(true);
    });

    describe('when user deletes a note', () => {
      it('triggers onDelete callback', () => {
        const { button, onDeleteSpy } = setup();
  
        button.simulate('click');
  
        expect(onDeleteSpy).toHaveBeenCalled();
      });
    });
  });
  
  describe('when component is disabled', () => {
    it('does not allow deleting', () => {
      const { button } = setup({ disabled: true });

      expect(button.exists()).toBe(false);
    });
  });
});
