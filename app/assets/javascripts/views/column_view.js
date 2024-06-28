import columnTemplate from 'templates/column.ejs';

const ColumnView = Backbone.View.extend({
  template: columnTemplate,

  events: {
    'click a.toggle-title': 'toggleAll',
    'click a.toggle-column': 'toggle',
  },

  initialize: function () {
    var $el = this.$el;

    this.data = $el.data();
    this.id = this.data.columnView;
    this.name = I18n.t('projects.show.' + this.data.columnView);
    this.hideable =
      this.data.hideable === undefined ? true : this.data.hideable;
    this.sortable = this.data.connect !== undefined;

    $el.addClass(this.data.columnView + '_column');
  },

  render: function () {
    this.$el.html(this.template({ id: this.id, name: this.name }));
    if (this.sortable) this.setSortable();
    return this;
  },

  toggleAll: function () {
    var stories = this.$('.story');
    _.each(stories, function (item) {
      $(item).toggle();
    });
  },

  toggle: function () {
    this.$el.toggle();
    this.trigger('visibilityChanged');
  },

  // Returns the child div containing the story and iteration elements.
  storyColumn: function () {
    return this.$('.story_column');
  },

  // Append a Backbone.View to this column
  appendView: function (view) {
    this.storyColumn().append(view.el);
  },

  // Adds the sortable behaviour to the column.
  setSortable: function () {
    this.storyColumn().sortable({
      opacity: 0.6,
      items: '.story:not(.accepted)',
      cancel: '.story-description, .note, .form-control',
      connectWith: this.data.connect,
      update: function (ev, ui) {
        ui.item.trigger('sortupdate', ev, ui);
      },
    });
  },

  // Returns the current visibility state of the column.
  hidden: function () {
    return this.$el.is(':hidden');
  },
});

export default ColumnView;
