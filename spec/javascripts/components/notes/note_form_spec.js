import React from 'react';
import { mount } from 'enzyme';

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
    const wrapper = mount(<NoteForm note={note} onSubmit={onSubmit} />);
    wrapper.find('.add-note').simulate('click');
    expect(onSubmit).toHaveBeenCalled();
  });
});
