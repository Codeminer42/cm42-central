import noteTemplate from 'templates/note.ejs';

const NoteView = Backbone.View.extend({
  template: noteTemplate,

  tagName: 'div',

  className: 'note',

  events: {
    'click a.delete-note': 'deleteNote',
  },

  render: function () {
    this.$el.html(this.template({ note: this.model }));
    return this;
  },

  deleteNote: function () {
    this.model.destroy();
    this.$el.remove();
    return false;
  },
});

export default NoteView;
