const UserCollection = require('collections/user_collection');

describe('UserCollection', () => {
  beforeEach(function () {
    const User = Backbone.Model.extend({
      name: 'user',
    });

    this.users = new UserCollection();
    this.users.add(new User({ id: 1, name: 'User 1' }));
    this.users.add(new User({ id: 2, name: 'User 2' }));
  });

  describe('utility methods', () => {
    it('should return an array for a select control', function () {
      expect(this.users.forSelect()).toEqual([['User 1', 1], ['User 2', 2]]);
    });
  });
});
