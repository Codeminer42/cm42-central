import Note from '../models/note';

const NoteCollection = Backbone.Collection.extend({
  model: Note,

  url: function() {
    return this.story.url() + '/notes';
  },

  saved: function() {
    return this.reject(function(note) {
      return note.isNew();
    });
  }
});

export default NoteCollection;
