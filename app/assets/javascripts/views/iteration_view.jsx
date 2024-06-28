import React from 'react';
import ReactDOM from 'react-dom';
import Iteration from 'components/stories/Iteration';

const IterationView = Backbone.View.extend({
  className: 'iteration',

  events: {
    click: 'toggleStories',
  },

  toggleStories: function () {
    if (this.model.needsLoad) {
      this.model.fetch();
    } else {
      this.model.stories().forEach(story => {
        story.set('isVisible', !story.get('isVisible'));
      });
    }
  },

  render: function () {
    ReactDOM.render(
      <Iteration
        number={this.model.get('number')}
        startDate={this.model.startDate().toDateString()}
        points={this.points()}
      />,
      this.$el[0]
    );

    return this;
  },

  // Returns the number of points in the iteration, unless the iteration is
  // the current iteration, in which case returns 'accepted/total' points.
  points: function () {
    if (this.model.get('column') === '#in_progress') {
      return this.model.acceptedPoints() + '/' + this.model.points();
    } else {
      return this.model.points();
    }
  },
});

export default IterationView;
