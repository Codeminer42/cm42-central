import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { shallow } from 'enzyme';

import NoteForm from 'components/notes/NoteForm';
import Note from 'models/note.js';

const note = new Note({note: ''});

describe('<NoteForm />', function() {

  beforeEach(function() {
    jasmineEnzyme();
    sinon.stub(I18n, 't');
    sinon.stub(window.md, 'makeHtml');
    sinon.stub(note, 'save');
  });

  afterEach(function() {
    I18n.t.restore();
    window.md.makeHtml.restore();
    note.save.restore();
  });

  it("should be able to save a note", function() {
    const wrapper = shallow(
      <NoteForm note={note} />
    );
    wrapper.find('.add-note').simulate('click');
    expect(note.save).toHaveBeenCalled();
  });

  it("should update its own value", function() {
    const wrapper = shallow( <NoteForm note={note} /> );
    wrapper.find('textarea').simulate('change', {
        target: {
            name: 'note',
            value: 'expectedNote',
        }
    });
    expect(wrapper).toHaveState('value', 'expectedNote');
  });

});
