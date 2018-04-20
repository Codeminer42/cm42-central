/* eslint import/first:"off" */
/* eslint max-len:"off" */
/* eslint no-undef:"off" */
/* eslint no-param-reassign:"off" */
/* eslint no-useless-escape:"off" */
/* eslint camelcase:"off" */
/* eslint prefer-destructuring:"off" */
/* eslint no-shadow:"off" */
import Operands from '../mixins/contextual_serach_operands';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SearchTootip from '../components/stories/search_tooltip';

const SearchResultsBarView = require('./search_results_bar_view');
const StoryView = require('./story_view');

module.exports = Backbone.View.extend({

  initialize() {
    this.appendSearchTooltip();
  },

  events: {
    submit: 'doSearch',
  },

  addBar(column) {
    const view = new SearchResultsBarView({ model: this.model }).render();
    this.appendViewToColumn(view, column);
  },

  addStory(story, column) {
    const view = new StoryView({ model: story, isSearchResult: true }).render();
    this.appendViewToColumn(view, column);
    view.setFocus();
  },

  appendViewToColumn(view, columnName) {
    $(columnName).append(view.el);
  },

  appendSearchTooltip() {
    this.$el.find('.drop-target').popover({
      delay: 200, // A small delay to stop the popovers triggering whenever the mouse is moving around
      html: true,
      container: 'body',
      trigger: 'hover',
      content: () => ReactDOMServer.renderToString(<SearchTootip />),
      placement: 'bottom',
    });
  },

  parseOperands(input) {
    const operandsArray = Object.keys(Operands);
    let query = this.handleTranslations(input.toLowerCase());

    operandsArray.forEach((operand) => {
      query = query.replace(new RegExp(`${operand}:`, 'g'), Operands[operand]);
    });
    return query;
  },

  handleTranslations(query, locale = I18n.defaultLocale) {
    const queries = query.split(',');
    const currentLocale = I18n.currentLocale();

    I18n.missingTranslation = () => false;

    if (currentLocale !== locale) {
      queries.forEach((entry) => {
        const operand = entry.match(/\w+/);
        const key = entry.match(/[^:]*$/)[0].trim();

        let translations = _.invert(I18n.translations[currentLocale].story[operand]);
        translations = I18n.t(`story.${operand}.${translations[key]}`, { locale });

        if (translations) {
          query = query.replace(key, translations);
        }
      });
    }
    return query;
  },

  addAll() {
    this.$('.loading-spin').addClass('show');
    const that = this;
    const searchedTerm = this.$el.find('input[type=text]').val();
    that.$ = $;
    that.$('#search_results').html('');
    that.$('.search_results_column').show();
    that.$('.search_results_column')
      .find('.toggle-title')
      .text(`\"${searchedTerm}\"`);

    this.addBar('#search_results');

    const search_results_ids = this.model.search.pluck('id');
    const stories = this.model.stories;
    _.each(search_results_ids, (id) => {
      const story = stories.get(id);
      if (!_.isUndefined(story)) {
        that.addStory(story, '#search_results');
      } else {
        // the search may return IDs that are not in the stories collection in the client-side
        // because of the STORIES_CEILING configuration
      }
    });

    this.$('.loading-spin').removeClass('show');
  },

  doSearch(e) {
    e.preventDefault();
    const that = this;
    this.model.search.fetch({
      data: {
        q: this.parseOperands(this.$el.find('input[type=text]').val()),
      },
      reset: true,
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
