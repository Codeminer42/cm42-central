import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { shallow } from 'enzyme';

import NoteComponent from 'components/notes/Note';
import NoteForm from 'components/notes/NoteForm';
import Note from 'models/note.js';

describe('<Note />', () => {
  let note;

  beforeEach(() => {
    jasmineEnzyme();
    sinon.stub(I18n, 't');
    sinon.stub(window.md, 'makeHtml');
    note = new Note({ note: 'Test Note' });
  });

  afterEach(() => {
    I18n.t.restore();
    window.md.makeHtml.restore();
  });

  it('should have its content parsed', () => {
    const wrapper = shallow(<NoteComponent note={note} />);
    const expectedNote = 'Test Note';
    expect(window.md.makeHtml).toHaveBeenCalledWith(expectedNote);
  });

  it('should be able to call handleDelete', () => {
    const handleDelete = sinon.stub();
    const wrapper = shallow(<NoteComponent
      note={note}
      disabled={false}
      handleDelete={handleDelete}
    />);
    wrapper.find('.delete-note').simulate('click');
    expect(handleDelete).toHaveBeenCalled();
  });

  describe('when not disabled', () => {
    it('should have an delete button', () => {
      const wrapper = shallow(<NoteComponent note={note} disabled={false} />);
      expect(wrapper.find('.delete-note')).toBePresent();
    });
  });

  describe('when disabled', () => {
    it('should not have a delete button', () => {
      const wrapper = shallow(<NoteComponent note={note} disabled />);
      expect(wrapper.find('.delete-note')).not.toBePresent();
    });
  });
});
