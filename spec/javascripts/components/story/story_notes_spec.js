import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { shallow } from 'enzyme';

import StoryNotes from 'components/story/StoryNotes';
import NoteForm from 'components/notes/NoteForm';
import NotesCollection from 'collections/note_collection.js';

const notes = new NotesCollection();
notes.add({ note: 'Test Note #1' });

describe('<StoryNotes />', function() {

  beforeEach(function() {
    jasmineEnzyme();
    sinon.stub(I18n, 't');
    sinon.stub(window.md, 'makeHtml');
  });

  afterEach(function() {
    I18n.t.restore();
    window.md.makeHtml.restore();
  });

  describe("when disabled", function() {

    it("should not have an <NoteForm />", function() {
      const wrapper = shallow(
        <StoryNotes notes={notes} disabled={true} />
      );
      expect(wrapper.find(NoteForm)).not.toBePresent();
    });

  });

  describe("when not disabled", function() {

    it("should have an <NoteForm />", function() {
      const wrapper = shallow(
        <StoryNotes notes={notes} disabled={false} />
      );
      expect(wrapper.find(NoteForm)).toBePresent();
    });

  });

});
