import React from 'react';
import { render } from '@testing-library/react';
import NotesList from 'components/story/note/NotesList';

describe('<NotesList/>', () => {
  const notesArray = [{ id: 1 }, { id: 2 }, { id: 3 }];

  it('render all notes in a <Note> component', () => {
    const onDelete = vi.fn();

    const { getAllByTestId } = render(
      <NotesList notes={notesArray} onDelete={onDelete} disabled={false} />
    );

    expect(getAllByTestId('note-component').length).toBe(notesArray.length);
  });
});
