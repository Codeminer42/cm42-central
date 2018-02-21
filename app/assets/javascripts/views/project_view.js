import StoryAttachment from 'components/story/StoryAttachment';
var StoryView = require('./story_view');
var IterationView = require('./iteration_view');
var ColumnView = require('./column_view');
var ColumnVisibilityButtonView = require('./column_visibility_button_view');
var HistoryView = require('./history_view');

module.exports = Backbone.View.extend({
  template: require('templates/project_view.ejs'),
  columns: {},

  initialize: function() {
    _.bindAll(this, 'addStory', 'addAll', 'render', 'noticeSaveError');

    this.$loadingSpin = this.$('.loading-spin');
    this.$columnToggles = this.$el.parent().find('#column-toggles');

    this.model.stories.on('add', this.addStory, this);
    this.model.stories.on('reset', this.addAll, this);
    this.model.stories.on('all', this.render, this);
    this.listenTo(this.model, 'change:userVelocity', this.addAll);
    this.listenTo(this.model, 'change:current_flow', this.prepareColumns);

    this.prepareColumns();
    this.$loadingSpin.show();
    this.model.stories.fetch({success: this.addAll});

  },

  prepareColumns: function() {
    // reset columns & columns toggle
    this.columns = {};
    this.$columnToggles.html('');
    this.$el.html(this.template({
      current_flow: this.model.get('current_flow'),
      default_flow: this.model.get('default_flow')
    }));

    this.historyView = new HistoryView({el: this.$('[data-history-view]'), users: this.model.users});

    _.each(this.$('[data-column-view]'), function(el) {
      var columnView = this.createColumnView($(el));
      this.columns[columnView.id] = columnView;

      if (columnView.hideable) {
        this.$columnToggles.append(
          $('<li class="sidebar-item"/>')
            .append(new ColumnVisibilityButtonView({columnView: columnView}).render().$el)
        );
      }
    }, this);

    this.addAll();
    this.scaleToViewport();
  },

  createColumnView: function(el) {
    var data = el.data();
    var column = new ColumnView({el: el});

    column.on('visibilityChanged', this.checkColumnViewsVisibility, this);
    column.render();

    return column;
  },

  // Triggered when the 'Add Story' button is clicked
  newStory: function() {
    if ($(window).width() <= 992) {
      _.each(this.columns, function(column, columnId) {
        if(columnId !== 'chilly_bin')
          if(!column.hidden())
            column.toggle();
      });
    }
    this.model.stories.add([{
      events: [], files: [], editing: true
    }]);
  },

  addStory: function(story, column) {
    // If column is blank determine it from the story.  When the add event
    // is bound on a collection, the callback sends the collection as the
    // second argument, so also check that column is a string and not an
    // object for those cases.
    if (_.isUndefined(column) || !_.isString(column)) {
      column = story.column;
    }
    var view = new StoryView({
      model: story,
    }).render();

    this.appendViewToColumn(view, column);
    view.setFocus();
    if (column === '#done') {
      view.$el.addClass('collapsed-iteration');
    }
  },

  appendViewToColumn: function(view, columnName) {
    if (columnName === '#chilly_bin') return $(columnName).prepend(view.el);
    $(columnName).append(view.el);
  },

  addIteration: function(iteration) {
    var that = this;
    var column = iteration.get('column');
    var view = new IterationView({model: iteration}).render();
    this.appendViewToColumn(view, column);
    _.each(iteration.stories(), function(story) {
      that.addStory(story, column);
    });
  },

  addAll: function() {
    var that = this;

    _.each(this.columns, function(column) {
      if (
         column.$el.hasClass('search_results_column') ||
         column.$el.hasClass('epic_column')
         ) return;
      column.$el.find('.story_column').html("");
    });

    this.model.rebuildIterations();

    // Render each iteration
    _.each(this.model.iterations, function(iteration) {
      that.addIteration(iteration);
    });

    // Render the chilly bin.  This needs to be rendered separately because
    // the stories don't belong to an iteration.
    _.each(this.model.stories.column('#chilly_bin'), function(story) {
      that.addStory(story);
    });

    this.$('#done div.iteration:last').click();
    this.$loadingSpin.hide();
    this.scrollToStory(window.location.hash || '');
  },

  scrollToStory: function(story_hash) {
    if ( story_hash.lastIndexOf('#story', 0) === 0 ) {
      var story = $(story_hash);
      if ( story.length > 0 ) {
        story.click();
        document.getElementById(story_hash.replace('#', '')).scrollIntoView();
        // clean url state so every refresh doesn't reopen the same story over and over
        if(window.history.pushState) {
            window.history.pushState('', '/', window.location.pathname)
        } else {
            window.location.hash = '';
        }
      }
    }
  },

  scaleToViewport: function() {
    var viewSize = this.$('.content-wrapper').height();
    var columnHeaderSize = this.$('.column_header:first').outerHeight();

    var height = viewSize - columnHeaderSize;

    this.$('.story_column, .activity_column').css('height', height + 'px');

    if ($(window).width() <= 992) {
      _.each(this.columns, function(column, columnId) {
        if(columnId !== 'in_progress')
          if(!column.hidden())
            column.toggle();
      });
      this.$('#form_search').hide();
    } else {
      this.$('#form_search').show();
    }
  },

  notice: function(message) {
    $.gritter.add(message);
  },

  // make sure there is at least one column opened
  checkColumnViewsVisibility: function() {
    if (window.projectView === undefined)
      return;

    var filtered = _.filter(window.projectView.columns, function(column) {
      if(!column.hidden())
        return true;
    });

    if(filtered.length === 0) {
      window.projectView.columns['in_progress'].toggle();
    }
  },

  usernames: function() {
    return this.model.users
      .map(function(user) { return user.get('username'); })
      .sort();
  },

  noticeSaveError: function(model) {
    this.notice({
      title: I18n.t("save error", {defaultValue: "Save error"}),
      text: model.errorMessages()
    });
  }
});
