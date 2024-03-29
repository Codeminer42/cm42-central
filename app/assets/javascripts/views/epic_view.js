import EpicBarView from './epic_bar_view';
import StoryView from './story_view';

const EpicView = Backbone.View.extend({
  initialize: function (options) {
    this.options = options;
    this.$('td.epic_column').css('display', 'table-cell');
    this.doSearch();
  },

  addBar: function (column) {
    var view = new EpicBarView({ model: this.model }).render();
    this.appendViewToColumn(view, column);
  },

  addStory: function (story, column) {
    var view = new StoryView({ model: story, isSearchResult: true }).render();
    this.appendViewToColumn(view, column);
    view.setFocus();
  },

  appendViewToColumn: function (view, columnName) {
    $(columnName).append(view.el);
  },

  addAll: function () {
    var that = this;
    that.$ = $;
    that.$('#epic').html('');
    that.$('td.epic_column').show();
    this.addBar('#epic');

    var search_results_ids = this.model.search.pluck('id');
    var stories = this.model.projectBoard.stories;
    _.each(search_results_ids, function (id) {
      var story = stories.get(id);
      if (!_.isUndefined(story)) {
        that.addStory(story, '#epic');
      } else {
        // the search may return IDs that are not in the stories collection in the client-side
        // because of the STORIES_CEILING configuration
      }
    });

    this.$('.loading-spin').removeClass('show');
  },

  doSearch: function (e) {
    this.$('.loading-spin').addClass('show');
    var that = this;
    this.model.search.fetch({
      reset: true,
      data: {
        label: this.options.label,
      },
      success: function () {
        that.addAll();
      },
      error: function (e) {
        window.projectView.notice({
          title: 'Search Error',
          text: e,
        });
      },
    });
  },
});

export default EpicView;
