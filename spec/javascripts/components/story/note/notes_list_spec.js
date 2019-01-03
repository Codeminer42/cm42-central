import React from 'react';
import { shallow } from 'enzyme';
import NotesList from 'components/story/note/NotesList';

describe('<NotesList/>', () => {
  const notesArray = [{ id: 1 }, { id: 2 }, { id: 3 }];

  it('render all notes in a <Note> component', () => {
    const onDelete = sinon.stub();

    const wrapper = shallow(
      <NotesList
        notes={notesArray}
        onDelete={onDelete}
      />
    );

    expect(wrapper.find('Note').length).toBe(notesArray.length)
  });
});
