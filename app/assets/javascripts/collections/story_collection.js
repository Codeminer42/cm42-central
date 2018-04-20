/* eslint no-return-assign:"off" */
const Story = require('models/story');

module.exports = Backbone.Collection.extend({
  model: Story,

  initialize() {
    _.bindAll(this, 'sort', 'addLabelsFromStory', 'resetLabels');
    const triggerReset = _.bind(this.trigger, this, 'reset');

    this.on('change:position', this.sort, this);
    this.on('change:state', this.sort, this);
    this.on('change:estimate', this.sort, this);
    this.on('change:labels', this.addLabelsFromStory, this);
    this.on('add', this.addLabelsFromStory, this);
    this.on('reset', this.resetLabels, this);
    this.on('sort', triggerReset, this);

    this.labels = [];
  },

  saveSorting(columnName) {
    let column = this;
    if (columnName) {
      column = this.column(columnName);
    }
    const orderedIds = column.map(model => model.id);
    Backbone.ajax({
      method: 'PUT',
      url: `${this.url}/sort`,
      data: { ordered_ids: orderedIds },
    });
  },

  comparator(story) {
    return story.position();
  },

  columnStoryIndex(story) {
    return this.column(story.column).indexOf(story);
  },

  nextOnColumn(story) {
    const index = this.columnStoryIndex(story) + 1;
    return this.storyByIndexOnColumn(index, story.column);
  },

  previousOnColumn(story) {
    const index = this.columnStoryIndex(story) - 1;
    return this.storyByIndexOnColumn(index, story.column);
  },

  storyByIndexOnColumn(index, column) {
    if (index >= this.length || index < 0) {
      return undefined;
    }
    return this.column(column)[index];
  },

  previous(story) {
    const index = this.indexOf(story) - 1;
    return this.storyByIndex(index);
  },

  next(story) {
    const index = this.indexOf(story) + 1;
    return this.storyByIndex(index);
  },

  storyByIndex(index) {
    if (index < 0 || index >= this.length) {
      return undefined;
    }
    return this.at(index);
  },

  // Returns all the stories in the named column, either #done, #in_progress,
  // #backlog or #chilly_bin
  column(column) {
    return this.select(story => story.column === column);
  },

  // Returns an array of the stories in a set of columns.  Pass an array
  // of the column names accepted by column().
  columns(columns) {
    const that = this;
    return _.flatten(_.map(columns, column => that.column(column)));
  },

  // Takes comma separated string of labels and adds them to the list of
  // availableLabels.  Any that are already present are ignored.
  addLabels(labels) {
    return (this.labels = _.union(this.labels, labels));
  },

  addLabelsFromStory(story) {
    return this.addLabels(story.labels());
  },

  resetLabels() {
    const collection = this;
    collection.each((story) => {
      collection.addLabelsFromStory(story);
    });
  },
});
