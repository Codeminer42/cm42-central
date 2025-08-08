import React from 'react';
import { render } from '@testing-library/react';

import NoteForm from 'components/notes/NoteForm';
import Note from 'models/note.js';
import { user } from '../../support/setup';

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

  it('should have an onSubmit callback', async function () {
    const onSubmit = vi.fn().mockReturnValueOnce($.Deferred());
    const { container } = render(<NoteForm note={note} onSubmit={onSubmit} />);
    const addNoteButton = container.querySelector('.add-note');
    await user.click(addNoteButton);

    expect(onSubmit).toHaveBeenCalled();
  });
});
