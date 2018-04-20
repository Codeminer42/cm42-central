/* eslint global-require:"off" */
module.exports = Backbone.View.extend({

  template: require('templates/search_results_bar.ejs'),

  className: 'iteration',

  render() {
    this.$el.html(this.template({ stories: this.model.search.length, points: this.points() }));
    return this;
  },

  points() {
    const estimates = this.model.search.pluck('estimate');
    const sum = _.reduce(estimates, (total, estimate) => total + estimate);
    return sum;
  },

});

