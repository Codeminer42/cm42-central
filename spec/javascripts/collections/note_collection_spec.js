import NoteCollection from 'collections/note_collection';

describe('NoteCollection', function() {
  let story;
  let note_collection;

  beforeEach(function() {
    var Story = Backbone.Model.extend({name: 'story'});
    story = new Story({url: '/foo'});
    story.url = function() { return '/foo'; };

    note_collection = new NoteCollection();
    note_collection.story = story;
  });

  describe("url", function() {

    it("should return the url", function() {
      expect(note_collection.url()).toEqual('/foo/notes');
    });

  });

  it("should return only saved notes", function() {
    note_collection.add({id: 1, note: "Saved note"});
    note_collection.add({note: "Unsaved note"});
    expect(note_collection.length).toEqual(2);
    expect(note_collection.saved().length).toEqual(1);
  });

});
