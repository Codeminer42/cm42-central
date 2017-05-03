import Tether from 'tether';
import Shepherd from 'tether-shepherd';

module.exports = Backbone.Model.extend({
  name: 'tour',

  initialize: function() {
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

  complete: function(user) {
    this.finishTour(user);
    this.shepherd.complete();
  },

  addStep: function(id, options) {
    this.shepherd.addStep(id, options);
  },

  finishTour: function(user) {
    user.set('finished_tour', true);

    const data = {
      user: {
        finished_tour: user.get('finished_tour')
      }
    };

    const options = {
      type: 'PUT',
      dataType: 'json',
      data: data,
      url: `/users/${user.get('id')}/tour`
    };

    return $.ajax(options);
  }
});
