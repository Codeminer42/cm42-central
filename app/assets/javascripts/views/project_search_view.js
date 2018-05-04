import Operands from '../mixins/contextual_serach_operands';
import React from 'react';
import ReactDOMServer from 'react-dom/server'
import SearchTootip from '../components/stories/search_tooltip';
var SearchResultsBarView = require('./search_results_bar_view');
var StoryView = require('./story_view');

module.exports = Backbone.View.extend({

  initialize: function() {
    this.appendSearchTooltip();
  },

  events: {
    "submit": "doSearch"
  },

  addBar: function(column) {
    var view = new SearchResultsBarView({model: this.model}).render();
    this.appendViewToColumn(view, column);
  },

  addStory: function(story, column) {
    var view = new StoryView({model: story, isSearchResult: true}).render();
    this.appendViewToColumn(view, column);
    view.setFocus();
  },

  appendViewToColumn: function(view, columnName) {
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

    operandsArray.forEach(operand => {
      query = query.replace(new RegExp(operand + ':', 'g'), Operands[operand]);
    });
    return query;
   },

   handleTranslations(query, locale = I18n.defaultLocale) {
    const queries = query.split(',');
    const currentLocale = I18n.currentLocale();

    I18n.missingTranslation = () => false;

    if (currentLocale !== locale) {
      queries.forEach(entry => {
        const operand = entry.match(/\w+/);
        const key = entry.match(/[^:]*$/)[0].trim();

        let translations = _.invert(I18n.translations[currentLocale].story[operand])
        translations = I18n.t(`story.${operand}.${translations[key]}`, { locale })

        if (translations) {
          query = query.replace(key, translations)
        }
      });
    }
    return query;
  },

  addAll: function() {
    this.$('.loading-spin').addClass('show');
    var that = this;
    var searchedTerm = this.$el.find('input[type=text]').val();
    that.$ = $;
    that.$('#search_results').html("");
    that.$('.search_results_column').show();
    that.$('.search_results_column')
        .find('.toggle-title')
        .text(`\"${searchedTerm}\"`);

    this.addBar('#search_results');

    this.model.search.forEach(function(searchResult) {
      that.addStory(searchResult, '#search_results');
    });

    this.$('.loading-spin').removeClass('show');
  },

  doSearch: function(e) {
    e.preventDefault();
    var that = this;
    this.model.search.fetch({
      data: {
        q: this.parseOperands(this.$el.find('input[type=text]').val())
      },
      reset: true,
      success: function() {
        that.addAll();
      },
      error: function(e) {
        window.projectView.notice({
          title: 'Search Error',
          text: e
        });
      }
    });
  },

});
