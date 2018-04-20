/* eslint global-require:"off" */
/* eslint camelcase:"off" */
/* eslint prefer-destructuring:"off" */
/* eslint no-unused-vars:"off" */
/* eslint no-shadow:"off" */
const EpicBarView = require('./epic_bar_view');

module.exports = Backbone.View.extend({

  initialize(options) {
    this.options = options;
    this.$('td.epic_column').css('display', 'table-cell');
    this.doSearch();
  },

  addBar(column) {
    const view = new EpicBarView({ model: this.model }).render();
    this.appendViewToColumn(view, column);
  },

  addStory(story, column) {
    const StoryView = require('./story_view');

    const view = new StoryView({ model: story, isSearchResult: true }).render();
    this.appendViewToColumn(view, column);
    view.setFocus();
  },

  appendViewToColumn(view, columnName) {
    $(columnName).append(view.el);
  },

  addAll() {
    const that = this;
    that.$ = $;
    that.$('#epic').html('');
    that.$('td.epic_column').show();
    this.addBar('#epic');

    const search_results_ids = this.model.search.pluck('id');
    const stories = this.model.stories;
    _.each(search_results_ids, (id) => {
      const story = stories.get(id);
      if (!_.isUndefined(story)) {
        that.addStory(story, '#epic');
      } else {
        // the search may return IDs that are not in the stories collection in the client-side
        // because of the STORIES_CEILING configuration
      }
    });

    this.$('.loading-spin').removeClass('show');
  },

  doSearch(e) {
    this.$('.loading-spin').addClass('show');
    const that = this;
    this.model.search.fetch({
      reset: true,
      data: {
        label: this.options.label,
      },
      success() {
        that.addAll();
      },
      error(e) {
        window.projectView.notice({
          title: 'Search Error',
          text: e,
        });
      },
    });
  },
});
