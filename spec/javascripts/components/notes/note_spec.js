import React from 'react';
import { shallow } from 'enzyme';
import NoteComponent from 'components/notes/Note';
import Note from 'models/note.js';

describe('<Note />', function() {
  let note;

  beforeEach(function() {
    sinon.stub(I18n, 't');
    sinon.stub(window.md, 'makeHtml');
    note = new Note({note: 'Test Note'});
  });

  afterEach(function() {
    I18n.t.restore();
    window.md.makeHtml.restore();
  });

  it("should have its content parsed", function() {
    const wrapper = shallow(<NoteComponent note={note} />);
    const expectedNote = 'Test Note';
    expect(window.md.makeHtml).toHaveBeenCalledWith(expectedNote);
  });

  it("should be able to call handleDelete", function() {
    const handleDelete = sinon.stub();
    const wrapper = shallow(
      <NoteComponent
        note={note}
        disabled={false}
        handleDelete={handleDelete}
      />
    );
    wrapper.find('.delete-note').simulate('click');
    expect(handleDelete).toHaveBeenCalled();
  });

  describe("when not disabled", function() {

    it("should have an delete button", function() {
      const wrapper = shallow(
        <NoteComponent note={note} disabled={false} />
      );
      expect(wrapper.find('.delete-note')).toExist();
    });

  });

  describe("when disabled", function() {

    it("should not have a delete button", function() {
      const wrapper = shallow(
        <NoteComponent note={note} disabled={true} />
      );
      expect(wrapper.find('.delete-note')).not.toExist();
    });

  });

});
