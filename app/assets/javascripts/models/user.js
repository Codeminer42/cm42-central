/* eslint no-multi-assign:"off" */
/* eslint no-unused-vars:"off" */
const User = module.exports = Backbone.Model.extend({
  defaults: {},

  name: 'user',

  url() {
    return `/users/${this.id}`;
  },
}, {
  getCurrent(callback) {
    const options = {
      type: 'GET',
      dataType: 'json',
      url: '/users/current',
    };

    return $.ajax(options)
      .then((data) => {
        const user = new User(data);

        user.attributes.tour_steps = JSON.parse(user.attributes.tour_steps);
        return user;
      });
  },
});
