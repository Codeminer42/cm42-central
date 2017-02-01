var Tether = require('tether');
var Shepherd = require('tether-shepherd');
var axios = require('axios');

function getCurrentUser() {
  return axios.get('/users/current');
}

function updateTour(user) {
  var remainingSteps = user.tour_steps.filter(step => step.done !== true);

  if(remainingSteps.length === 0)
    user.tour = false;

  var data = {
    user: {
      tour: user.tour,
      tour_steps: JSON.stringify(user.tour_steps)
    }
  };

  return axios.put(`/users/${user.id}/tour`, data);
}

var firstTimeTour = module.exports =  {
  start: function() {
    var tour = new Shepherd.Tour({
      defaults: {
        classes: 'shepherd-theme-arrows',
        scrollTo: false
      }
    });

    function generateButtons(index, user) {
      var buttons = [];

      if(index === 0) {
        buttons.push({
          text: I18n.t("skip"),
          action: function() {
            user.tour = false;
            updateTour(user);
            tour.complete();
          },
          classes: 'btn btn-default pull-left'
        });
      }

      buttons.push({
        text: I18n.t(index == user.tour_steps.length - 1 ? 'finish' : 'next'),
        action: function() {
          user.tour_steps[index].done = true;

          updateTour(user);
          tour.next();
        }
      });

      return buttons;
    }

    function setupTour(user, tour) {
      user.tour_steps.map((step, index) => {
        var tourStep = Object.assign({}, step);

        var selector = step.attachTo.split(" ")[0];

        if($(selector).length > 0 && step.done !== true) {
          tourStep.title = I18n.t(step.title);
          tourStep.text = I18n.t(step.text);
          tourStep.classes = 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text';
          tourStep.buttons = generateButtons(index, user);

          tour.addStep(tourStep.title.toLowerCase().replace(' ', '_'), tourStep);
        }
      });
    };

    function getCurrentUserSuccess(res) {
      var user = res.data.user;
      user.tour_steps = JSON.parse(user.tour_steps);

      if(user.tour === true) {
        setupTour(user, tour);
        tour.start();
      }
    }

    getCurrentUser()
      .then(getCurrentUserSuccess);
  }
}
