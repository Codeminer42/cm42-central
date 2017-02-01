module.exports = Backbone.Model.extend({
  name: 'user',
  initialize: function() {
  },
  getCurrent: function(callback) {
    var options = {
      type: 'GET',
      dataType: 'json',
      url: '/users/current',
      success: callback,
    };

    return $.ajax(options);
  }
});
