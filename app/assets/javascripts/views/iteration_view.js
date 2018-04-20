/* eslint no-constant-condition:"off" */
import React from 'react';
import ReactDOM from 'react-dom';
import Iteration from 'components/stories/Iteration';

module.exports = Backbone.View.extend({


  className: 'iteration',

  events: {
    click: 'toggleStories',
  },

  toggleStories() {
    let item = this.$el.next();
    while (true) {
      if ($(item).hasClass('story')) {
        $(item).toggle();
      }
      item = item.next();
      if (item.length === 0 || $(item).hasClass('iteration')) {
        break;
      }
    }
  },

  render() {
    ReactDOM.render(
      <Iteration
        number={this.model.get('number')}
        startDate={this.model.startDate().toDateString()}
        points={this.points()}
      />,
      this.$el[0],
    );

    return this;
  },

  // Returns the number of points in the iteration, unless the iteration is
  // the current iteration, in which case returns 'accepted/total' points.
  points() {
    if (this.model.get('column') === '#in_progress') {
      return `${this.model.acceptedPoints()}/${this.model.points()}`;
    }
    return this.model.points();
  },

});
