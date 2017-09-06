const User = module.exports = Backbone.Model.extend({
  defaults: {},

  name: 'user',

  url: function() {
    return `/users/${this.id}`;
  }
}, {
  getCurrent: function(callback) {
    const options = {
      type: 'GET',
      dataType: 'json',
      url: '/users/current'
    };

    return $.ajax(options)
      .then(function(data) {
        const user = new User(data);

        user.attributes.tour_steps = JSON.parse(user.attributes.tour_steps);
        return user;
      });
  }
});
