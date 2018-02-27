var Story = require('models/story');

module.exports = Backbone.Collection.extend({
  model: Story,

  initialize: function() {
    _.bindAll(this, 'sort', 'addLabelsFromStory', 'resetLabels');
    var triggerReset = _.bind(this.trigger, this, 'reset');

    this.on('change:position', this.sort, this);
    this.on('change:state', this.sort, this);
    this.on('change:estimate', this.sort, this);
    this.on('change:labels', this.addLabelsFromStory, this);
    this.on('add', this.addLabelsFromStory, this);
    this.on('reset', this.resetLabels, this);
    this.on('sort', triggerReset, this);

    this.labels = [];
  },

  round: function(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  },

  roundPosition: function(thisId, previousStoryId) {
    const precision = 5;
    const correctionFactor = 0.0001;

    var thisStory = this.get(thisId);
    var previousStory = this.get(previousStoryId);

    var thisStoryPosition = this.round(thisStory.position(), precision);
    thisStory.set({ position: thisStoryPosition });
  
    if (typeof previousStory !== 'undefined') {
      var previousStoryPosition = this.round(previousStory.position(), precision);
      if (thisStoryPosition <= previousStoryPosition) {
        const difference = Math.abs(previousStoryPosition - thisStoryPosition) + correctionFactor;
        previousStory.set({ position: this.round(previousStoryPosition - difference, precision) });
      } 
      var beforePreviousStory = this.previousOnColumn(previousStory);
    }
    if (typeof beforePreviousStory !== 'undefined') {
      this.roundPosition(previousStoryId, beforePreviousStory.id);
    }
  },

  calculateNewPosition: function(previousStoryId, nextStoryId) {
    if (!_.isUndefined(previousStoryId)) {
      return this.calculatePositionAfter(previousStoryId);
    }
    if (!_.isUndefined(nextStoryId)) {
      return this.calculatePositionBefore(nextStoryId);
    }
    if (this.length !== 1) {
      throw new Error("Unable to determine previous or next story id for dropped story");
    }
  },

  calculatePositionAfter: function(beforeId) {
    const before = this.get(beforeId);
    const after = this.nextOnColumn(before);
    var afterPosition;
    if (typeof after === 'undefined') {
      afterPosition = before.position() + 2;
    } else {
      afterPosition = after.position();
    }
    const difference = (afterPosition - before.position()) / 2;
    const newPosition = difference + before.position();
    return newPosition;
  },

  calculatePositionBefore: function(afterId) {
    const after = this.get(afterId);
    const before = this.previousOnColumn(after);
    var beforePosition;
    if (typeof before === 'undefined') {
      beforePosition = 0.0;
    } else {
      beforePosition = before.position();
    }
    const difference = (after.position() - beforePosition) / 2;
    const newPosition = difference + beforePosition;
    return newPosition;
  },

  normalizePositions: function(columnName) {
    var column = this;
    if (columnName) {
      column = this.column(columnName);
    }
    var orderedIds = column.map(
      function(model) {
        return model.id;
      }
    );
    Backbone.ajax({
      method: 'PUT',
      url: this.url + '/sort',
      data: { ordered_ids: orderedIds }
    });
  },

  comparator: function(story) {
    return story.position();
  },

  columnStoryIndex: function(story) {
    return this.column(story.column).indexOf(story);
  },

  nextOnColumn: function(story) {
    var index =  this.columnStoryIndex(story) + 1;
    return this.storyByIndexOnColumn(index, story.column);
  },

  previousOnColumn: function(story) {
    var index = this.columnStoryIndex(story) - 1;
    return this.storyByIndexOnColumn(index, story.column);
  },

  storyByIndexOnColumn: function(index, column) {
    if(index >= this.length || index < 0) {
      return undefined;
    }
    return this.column(column)[index];
  },

  previous: function(story) {
    var index = this.indexOf(story) - 1;
    return this.storyByIndex(index);
  },

  next: function(story) {
    var index = this.indexOf(story) + 1;
    return this.storyByIndex(index);
  },

  storyByIndex: function(index) {
    if(index < 0 || index >= this.length) {
      return undefined;
    }
    return this.at(index);
  },

  // Returns all the stories in the named column, either #done, #in_progress,
  // #backlog or #chilly_bin
  column: function(column) {
    return this.select(function(story) {
      return story.column === column;
    });
  },

  // Returns an array of the stories in a set of columns.  Pass an array
  // of the column names accepted by column().
  columns: function(columns) {
    var that = this;
    return _.flatten(_.map(columns, function(column) {
      return that.column(column);
    }));
  },

  // Takes comma separated string of labels and adds them to the list of
  // availableLabels.  Any that are already present are ignored.
  addLabels: function(labels) {
    return (this.labels = _.union(this.labels,labels));
  },

  addLabelsFromStory: function(story) {
    return this.addLabels(story.labels());
  },

  resetLabels: function() {
    var collection = this;
    collection.each(function(story) {
      collection.addLabelsFromStory(story);
    });
  }
});
