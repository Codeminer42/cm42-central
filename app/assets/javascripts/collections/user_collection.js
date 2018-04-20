const User = require('models/user');

module.exports = Backbone.Collection.extend({
  model: User,

  comparator(user) {
    return user.get('name');
  },

  forSelect() {
    return this.sort().map((user) => [user.get('name'), user.id]);
  },
});
