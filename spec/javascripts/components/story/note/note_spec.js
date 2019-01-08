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

  describe('when user deletes a note', () => {
    it('triggers onDelete callback', () => {
      const onDeleteSpy = sinon.spy();

      const wrapper = shallow(
        <Note
          note={note}
          onDelete={onDeleteSpy}
        />
      );

      const button = wrapper.find('.delete-note-button');

      button.simulate('click');

      expect(onDeleteSpy).toHaveBeenCalled();
    });
  });
});
