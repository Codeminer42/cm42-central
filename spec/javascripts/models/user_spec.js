import User from 'models/user';

describe('User', () => {
  beforeEach(function () {
    const userData = {
      email: 'foo@bar.com',
      finished_tour: false,
      id: 1,
      initials: 'FB',
      name: 'Foo Bar',
      username: 'foobar',
      tour_steps: '[]',
    };

    vi.spyOn($, 'ajax').mockImplementation(arg => {
      const object = {
        type: 'GET',
        dataType: 'json',
        url: '/users/current',
      };

      if (JSON.stringify(arg) === JSON.stringify(object))
        return $.when(userData);
    });
  });

  it('returns current user', function (done) {
    User.getCurrent().then(currentUser => {
      expect(currentUser.attributes).toEqual({
        email: 'foo@bar.com',
        finished_tour: false,
        id: 1,
        initials: 'FB',
        name: 'Foo Bar',
        username: 'foobar',
        tour_steps: [],
      });

      expect(currentUser instanceof User).toEqual(true);
      done();
    });
  });
});
