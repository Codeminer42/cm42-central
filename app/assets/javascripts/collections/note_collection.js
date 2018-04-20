const Note = require('models/note');

module.exports = Backbone.Collection.extend({
  model: Note,

  url() {
    return `${this.story.url()}/notes`;
  },

  saved() {
    return this.reject((note) => note.isNew());
  },
});
