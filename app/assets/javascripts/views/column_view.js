/* eslint global-require:"off" */
/* eslint prefer-destructuring:"off" */
/* eslint no-undef:"off" */
module.exports = Backbone.View.extend({
  template: require('templates/column.ejs'),

  events: {
    'click a.toggle-title': 'toggleAll',
    'click a.toggle-column': 'toggle',
  },

  initialize() {
    const $el = this.$el;

    this.data = $el.data();
    this.id = this.data.columnView;
    this.name = I18n.t(`projects.show.${this.data.columnView}`);
    this.hideable = this.data.hideable === undefined ? true : this.data.hideable;
    this.sortable = this.data.connect !== undefined;

    $el.addClass(`${this.data.columnView}_column`);
  },

  render() {
    this.$el.html(this.template({ id: this.id, name: this.name }));
    if (this.sortable) this.setSortable();
    return this;
  },

  toggleAll() {
    const stories = this.$('.story');
    _.each(stories, (item) => {
      $(item).toggle();
    });
  },

  toggle() {
    this.$el.toggle();
    this.trigger('visibilityChanged');
  },

  // Returns the child div containing the story and iteration elements.
  storyColumn() {
    return this.$('.story_column');
  },

  // Append a Backbone.View to this column
  appendView(view) {
    this.storyColumn().append(view.el);
  },

  // Adds the sortable behaviour to the column.
  setSortable() {
    this.storyColumn().sortable({
      opacity: 0.6,
      items: '.story:not(.accepted)',
      connectWith: this.data.connect,
      update(ev, ui) {
        ui.item.trigger('sortupdate', ev, ui);
      },
    });
  },

  // Returns the current visibility state of the column.
  hidden() {
    return this.$el.is(':hidden');
  },
});
