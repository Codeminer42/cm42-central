var Tour = require('models/tour');
var User = require('models/user');

var firstTimeTour = module.exports =  {
  start: function() {
    var user = new User();
    var tour = new Tour();

    function generateButtons(index, user) {
      var buttons = [];

      if(index === 0) {
        buttons.push({
          text: I18n.t("skip"),
          action: function() {
            user.tour = false;
            tour.update(user);
            tour.complete();
          },
          classes: 'btn btn-default pull-left'
        });
      }

      buttons.push({
        text: I18n.t(index == user.tour_steps.length - 1 ? 'finish' : 'next'),
        action: function() {
          user.tour_steps[index].done = true;

          tour.update(user);
          tour.next();
        }
      });

      return buttons;
    }

    function getSelectorFromStepAttach(attach) {
      return attach.split(" ")[0];
    }

    function setupTour(user, tour) {
      user.tour_steps.forEach(function(step, index) {
        var tourStep = Object.assign({}, step);

        var selector = getSelectorFromStepAttach(step.attachTo);

        if($(selector).length > 0 && !step.done) {
          tourStep.title = I18n.t(step.title);
          tourStep.text = I18n.t(step.text);
          tourStep.classes = 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text';
          tourStep.buttons = generateButtons(index, user);

          tour.addStep(tourStep.title.toLowerCase().replace(' ', '_'), tourStep);
        }
      });
    };

    function getCurrentUserSuccess(user) {
      var currentUser = user.attributes;
      currentUser.tour_steps = JSON.parse(currentUser.tour_steps);

      if(currentUser.tour === true) {
        setupTour(currentUser, tour);
        tour.start();
      }
    }

    User.getCurrent().then(getCurrentUserSuccess);
  }
}
