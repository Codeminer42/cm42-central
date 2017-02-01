var User = module.exports = Backbone.Model.extend({
  name: 'user',
  url: function() {
    return '/users/' + this.id;
  }
}, {
  getCurrent: function(callback) {
    var options = {
      type: 'GET',
      dataType: 'json',
      url: '/users/current'
    };

    return $.ajax(options)
      .then(function(data) {
        return new User(data.user);
      })
      .then(function(user) {
        user.attributes.tour_steps = JSON.parse(user.attributes.tour_steps);
        return user;
      });
  }
});
