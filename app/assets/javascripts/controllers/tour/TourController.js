import Tour from 'models/tour';
import User from 'models/user';

export default class TourController {
  initialize() {
    User.getCurrent().then((currentUser) => {
      if(!currentUser.get('finished_tour')) {
        this.tour = new Tour(currentUser);
        this.setupTour(currentUser);
        this.tour.start();
      }
    });
  }

  generateButtons(index, user) {
    const lastStep = user.get('tour_steps').length - 1;
    const buttons = [];

    if(index !== lastStep) {
      buttons.push({
        text: I18n.t('skip'),
        action: (function() {
          this.tour.complete(user);
        }).bind(this),
        classes: 'btn btn-default pull-left'
      });
    }

    buttons.push({
      text: I18n.t(index === lastStep ? 'finish' : 'next'),
      action: (function() {
        this.tour.next();

        if(index === lastStep) {
          this.tour.complete(user);
        }
      }).bind(this)
    });

    return buttons;
  }

  setupTour(user) {
    user.get('tour_steps').forEach(function(step, index) {
      const selector = this.getSelectorFromStepAttach(step.attachTo);

      if($(selector).length > 0) {
        const tourStep = {
          title: I18n.t(step.title),
          text: I18n.t(step.text),
          attachTo: step.attachTo,
          classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
          buttons: this.generateButtons(index, user)
        };

        this.tour.addStep(tourStep.title.toLowerCase().replace(' ', '_'), tourStep);
      }
    }, this);
  }

  getSelectorFromStepAttach(attach) {
    return attach.split(" ")[0];
  }
}
