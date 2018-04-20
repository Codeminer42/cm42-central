import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { mount } from 'enzyme';

import NoteForm from 'components/notes/NoteForm';
import Note from 'models/note.js';

describe('<NoteForm />', () => {
  let note;

  beforeEach(() => {
    jasmineEnzyme();
    note = new Note({ note: '' });
    sinon.stub(I18n, 't');
    sinon.stub(window.md, 'makeHtml');
    sinon.stub(note, 'save');
  });

  afterEach(() => {
    I18n.t.restore();
    window.md.makeHtml.restore();
    note.save.restore();
  });

  it('should have an onSubmit callback', () => {
    const onSubmit = sinon.stub().returns($.Deferred());
    const wrapper = mount(<NoteForm
      note={note}
      onSubmit={onSubmit}
    />);
    wrapper.find('.add-note').simulate('click');
    expect(onSubmit).toHaveBeenCalled();
  });
});
