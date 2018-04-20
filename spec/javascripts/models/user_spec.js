import User from 'models/user';

describe('User', () => {
  beforeEach(() => {
    const userData = {
      email: 'foo@bar.com',
      finished_tour: false,
      id: 1,
      initials: 'FB',
      name: 'Foo Bar',
      username: 'foobar',
      tour_steps: '[]',
    };

    sinon.stub($, 'ajax').withArgs({
      type: 'GET',
      dataType: 'json',
      url: '/users/current',
    }).returns($.when(userData));
  });

  afterEach(() => $.ajax.restore());

  it('returns current user', (done) => {
    User.getCurrent().then((currentUser) => {
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
