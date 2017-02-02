var User = module.exports = Backbone.Model.extend({
  name: 'user',
  initialize: function() {
  }
}, {
  getCurrent: function(callback) {
    var options = {
      type: 'GET',
      dataType: 'json',
      url: '/users/current'

    };

    return $.ajax(options).then(function(data) {
      return new User(data.user);
    });
  }
});
