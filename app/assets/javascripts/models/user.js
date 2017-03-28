module.exports = Backbone.Model.extend({
  name: 'user',

  url: function() {
    return '/users/' + this.id;
  }
});
