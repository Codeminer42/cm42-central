/* eslint no-unused-vars:"off" */
/* eslint global-require:"off" */
/* eslint prefer-destructuring:"off" */
/* eslint consistent-return:"off" */
/* eslint camelcase:"off" */
/* eslint no-undef:"off" */
/* eslint func-names:"off" */
/* eslint no-param-reassign:"off" */
import AttachmentOptions from 'models/attachmentOptions';
import StoryAttachment from 'components/story/StoryAttachment';

const StoryView = require('./story_view');
const IterationView = require('./iteration_view');
const ColumnView = require('./column_view');
const ColumnVisibilityButtonView = require('./column_visibility_button_view');
const HistoryView = require('./history_view');

module.exports = Backbone.View.extend({
  template: require('templates/project_view.ejs'),
  columns: {},

  initialize() {
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
    this.model.stories.fetch({ success: this.addAll });

    const attachmentOptions = new AttachmentOptions({
      refreshCallback: (options) => {
        this.attachmentOptions = options;
        this.trigger('attachmentOptions', options);
      },
    });

    attachmentOptions.fetch();
  },

  prepareColumns() {
    // reset columns & columns toggle
    this.columns = {};
    this.$columnToggles.html('');
    this.$el.html(this.template({
      current_flow: this.model.get('current_flow'),
      default_flow: this.model.get('default_flow'),
    }));

    this.historyView = new HistoryView({ el: this.$('[data-history-view]'), users: this.model.users });

    _.each(this.$('[data-column-view]'), function (el) {
      const columnView = this.createColumnView($(el));
      this.columns[columnView.id] = columnView;

      if (columnView.hideable) {
        this.$columnToggles.append($('<li class="sidebar-item"/>')
          .append(new ColumnVisibilityButtonView({ columnView }).render().$el));
      }
    }, this);

    this.addAll();
    this.scaleToViewport();
  },

  createColumnView(el) {
    const data = el.data();
    const column = new ColumnView({ el });

    column.on('visibilityChanged', this.checkColumnViewsVisibility, this);
    column.render();

    return column;
  },

  // Triggered when the 'Add Story' button is clicked
  newStory() {
    if ($(window).width() <= 992) {
      _.each(this.columns, (column, columnId) => {
        if (columnId !== 'chilly_bin') {
          if (!column.hidden()) { column.toggle(); }
        }
      });
    }
    this.model.stories.add([{
      events: [], files: [], editing: true,
    }]);
  },

  addStory(story, column) {
    // If column is blank determine it from the story.  When the add event
    // is bound on a collection, the callback sends the collection as the
    // second argument, so also check that column is a string and not an
    // object for those cases.
    if (_.isUndefined(column) || !_.isString(column)) {
      column = story.column;
    }
    const view = new StoryView({
      model: story,
      attachmentOptions: this.attachmentOptions,
    }).render();

    view.listenTo(this, 'attachmentOptions', (options) => {
      view.trigger('attachmentOptions', options);
    });

    this.appendViewToColumn(view, column);
    view.setFocus();
    if (column === '#done') {
      view.$el.addClass('collapsed-iteration');
    }
  },

  appendViewToColumn(view, columnName) {
    if (columnName === '#chilly_bin') return $(columnName).prepend(view.el);
    $(columnName).append(view.el);
  },

  addIteration(iteration) {
    const that = this;
    const column = iteration.get('column');
    const view = new IterationView({ model: iteration }).render();
    this.appendViewToColumn(view, column);
    _.each(iteration.stories(), (story) => {
      that.addStory(story, column);
    });
  },

  addAll() {
    const that = this;

    _.each(this.columns, (column) => {
      if (
        column.$el.hasClass('search_results_column') ||
         column.$el.hasClass('epic_column')
      ) return;
      column.$el.find('.story_column').html('');
    });

    this.model.rebuildIterations();

    // Render each iteration
    _.each(this.model.iterations, (iteration) => {
      that.addIteration(iteration);
    });

    // Render the chilly bin.  This needs to be rendered separately because
    // the stories don't belong to an iteration.
    _.each(this.model.stories.column('#chilly_bin'), (story) => {
      that.addStory(story);
    });

    this.$('#done div.iteration:last').click();
    this.$loadingSpin.hide();
    this.scrollToStory(window.location.hash || '');
  },

  scrollToStory(story_hash) {
    if (story_hash.lastIndexOf('#story', 0) === 0) {
      const story = $(story_hash);
      if (story.length > 0) {
        story.click();
        document.getElementById(story_hash.replace('#', '')).scrollIntoView();
        // clean url state so every refresh doesn't reopen the same story over and over
        if (window.history.pushState) {
          window.history.pushState('', '/', window.location.pathname);
        } else {
          window.location.hash = '';
        }
      }
    }
  },

  scaleToViewport() {
    const viewSize = this.$('.content-wrapper').height();
    const columnHeaderSize = this.$('.column_header:first').outerHeight();

    const height = viewSize - columnHeaderSize;

    this.$('.story_column, .activity_column').css('height', `${height}px`);

    if ($(window).width() <= 992) {
      _.each(this.columns, (column, columnId) => {
        if (columnId !== 'in_progress') {
          if (!column.hidden()) { column.toggle(); }
        }
      });
      this.$('#form_search').hide();
    } else {
      this.$('#form_search').show();
    }
  },

  notice(message) {
    $.gritter.add(message);
  },

  // make sure there is at least one column opened
  checkColumnViewsVisibility() {
    if (window.projectView === undefined) { return; }

    const filtered = _.filter(window.projectView.columns, (column) => {
      if (!column.hidden()) { return true; }
    });

    if (filtered.length === 0) {
      window.projectView.columns.in_progress.toggle();
    }
  },

  usernames() {
    return this.model.users
      .map(user => user.get('username'))
      .sort();
  },

  noticeSaveError(model) {
    this.notice({
      title: I18n.t('save error', { defaultValue: 'Save error' }),
      text: model.errorMessages(),
    });
  },
});
