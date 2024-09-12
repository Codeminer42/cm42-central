import React from 'react';
import { shallow } from 'enzyme';
import Note from 'components/story/note/Note';

describe('<Note/>', () => {
  const note = {
    id: 42,
    note: 'test Note',
    userName: 'foo',
    createdAt: '27/08/2018',
  };

  const setup = propOverrides => {
    const onDeleteSpy = vi.fn();

    const wrapper = shallow(
      <Note
        note={note}
        onDelete={onDeleteSpy}
        disabled={false}
        {...propOverrides}
      />
    );

    const deleteButton = wrapper.find('.delete-note-button');

    return { wrapper, deleteButton, onDeleteSpy };
  };

  describe('when component is enabled', () => {
    it('allows editing', () => {
      const { deleteButton } = setup();

      expect(deleteButton.exists()).toBe(true);
    });

    describe('when user deletes a note', () => {
      it('triggers onDelete callback', () => {
        const { deleteButton, onDeleteSpy } = setup();

        deleteButton.simulate('click');

        expect(onDeleteSpy).toHaveBeenCalled();
      });
    });
  });

  describe('when component is disabled', () => {
    it('does not allow deleting', () => {
      const { deleteButton } = setup({ disabled: true });

      expect(deleteButton.exists()).toBe(false);
    });
  });
});
