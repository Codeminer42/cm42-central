import UserCollection from 'collections/user_collection';

describe('UserCollection', function() {
  let users;

  beforeEach(function() {
    var User = Backbone.Model.extend({
      name: 'user'
    });

    users = new UserCollection();
    users.add(new User({id: 1, name: 'User 1'}));
    users.add(new User({id: 2, name: 'User 2'}));
  });

  describe("utility methods", function() {

    it("should return an array for a select control", function() {
      expect(users.forSelect()).toEqual([['User 1',1],['User 2',2]]);
    });

  });

});
