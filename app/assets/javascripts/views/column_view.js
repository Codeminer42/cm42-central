module.exports = Backbone.View.extend({

  template: require('templates/column.ejs'),

  tagName: 'td',

  events: {
    'click a.toggle-title': 'toggleAll',
    'click a.toggle-column': 'toggle'
  },

  initialize: function() {
    var data = this.$el.data();
    this.id  = data.columnView;
    this.name = I18n.t('projects.show.' + data.columnView);
    this.sortable = data.connect !== undefined
    this.$el.addClass(data.columnView + '_column');
    this.hideable = data.hideable == undefined ? true : data.hideable;

    if (data.connect) {
      this.$el
        .find('.ui-sortable')
        .sortable('option', 'connectWith', data.connect);
    }
  },

  render: function() {
    this.$el.html(this.template({id: this.id, name: this.name}));
    if (this.sortable) this.setSortable();
    return this;
  },

  toggleAll: function() {
    var stories = this.$('.story');
    _.each(stories, function(item) {
      $(item).toggle();
    });
  },

  toggle: function() {
    this.$el.toggle();
    this.trigger('visibilityChanged');
  },

  // Returns the child div containing the story and iteration elements.
  storyColumn: function() {
    return this.$('.storycolumn');
  },

  // Append a Backbone.View to this column
  appendView: function(view) {
    this.storyColumn().append(view.el);
  },

  // Adds the sortable behaviour to the column.
  setSortable: function() {
    this.storyColumn().sortable({
      handle: '.story-title', opacity: 0.6, items: ".story:not(.accepted)",
      update: function(ev, ui) {
        ui.item.trigger("sortupdate", ev, ui);
      }
    });
  },

  // Returns the current visibility state of the column.
  hidden: function() {
    return this.$el.is(':hidden');
  }
});
