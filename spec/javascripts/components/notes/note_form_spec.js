import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import NoteForm from 'components/notes/NoteForm';
import Note from 'models/note.js';

describe('<NoteForm />', function () {
  let note;

  beforeEach(function () {
    note = new Note({ note: '' });
    vi.spyOn(I18n, 't');
    vi.spyOn(window.md, 'makeHtml');
    vi.spyOn(note, 'save');
  });

  afterEach(function () {
    I18n.t.mockRestore();
    window.md.makeHtml.mockRestore();
    note.save.mockRestore();
  });

  it('should have an onSubmit callback', function () {
    const onSubmit = vi.fn().mockReturnValueOnce($.Deferred());
    const { getByTestId } = render(
      <NoteForm note={note} onSubmit={onSubmit} />
    );
    const addNoteButton = getByTestId('add-note-button');
    fireEvent.click(addNoteButton);

    expect(onSubmit).toHaveBeenCalled();
  });
});
