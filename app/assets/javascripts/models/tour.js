var Tether = require('tether');
var Shepherd = require('tether-shepherd');

module.exports = Backbone.Model.extend({
  name: 'tour',
  initialize: function(){
  },
  create: function() {
    return new Shepherd.Tour({
      defaults: {
        classes: 'shepherd-theme-arrows',
        scrollTo: false
      }
    })
  },
  update: function(user) {
    var remainingSteps = user.tour_steps.filter(step => step.done !== true);

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
