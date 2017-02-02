var Tether = require('tether');
var Shepherd = require('tether-shepherd');

module.exports = Backbone.Model.extend({
  name: 'tour',
  initialize: function(){
    this.shepherd = new Shepherd.Tour({
      defaults: {
        classes: 'shepherd-theme-arrows',
        scrollTo: false
      }
    });
  },
  start: function() {
    this.shepherd.start();
  },
  next: function() {
    this.shepherd.next();
  },
  complete: function() {
    this.shepherd.complete();
  },
  addStep: function(id, options) {
    this.shepherd.addStep(id, options);
  },
  update: function(user) {
    var remainingSteps = user.tour_steps.filter(function(step) {
      return !step.done;
    });

    if(remainingSteps.length === 0)
      user.tour = false;

    var data = {
      user: {
        tour: user.tour,
        tour_steps: JSON.stringify(user.tour_steps)
      }
    };

    var options = {
      type: 'PUT',
      dataType: 'json',
      data: data,
      url: `/users/${user.id}/tour`
    };

    return $.ajax(options);
  }
});
