/* eslint global-require:"off" */
module.exports = Backbone.View.extend({

  template: require('templates/note.ejs'),

  tagName: 'div',

  className: 'note',

  events: {
    'click a.delete-note': 'deleteNote',
  },

  render() {
    this.$el.html(this.template({ note: this.model }));
    return this;
  },

  deleteNote() {
    this.model.destroy();
    this.$el.remove();
    return false;
  },
});
