/* eslint no-unused-vars: "off" */
import Tether from 'tether';
import Shepherd from 'tether-shepherd';

export default class Tour {
  constructor(user) {
    this.user = user;

    this.shepherd = new Shepherd.Tour({
      defaults: {
        classes: 'shepherd-theme-arrows',
        scrollTo: false,
      },
    });
  }

  start() {
    this.shepherd.start();
  }

  next() {
    this.shepherd.next();
  }

  complete() {
    this.finishTour(this.user);
    this.shepherd.complete();
  }

  addStep(id, options) {
    this.shepherd.addStep(id, options);
  }

  finishTour() {
    this.user.set('finished_tour', true);

    const data = {
      user: {
        finished_tour: this.user.get('finished_tour'),
      },
    };

    const options = {
      type: 'PUT',
      dataType: 'json',
      data,
      url: `/users/${this.user.get('id')}/tour`,
    };

    return $.ajax(options);
  }
}
