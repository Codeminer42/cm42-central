import TabNotification from 'mixins/tab_notification';

describe('Project Notification', function() {
  var tabNotification = TabNotification;

  beforeAll(function () {
    sinon.stub(TabNotification, 'handleChangeTitle');
    $('body').data({
      notificationIconUrl: 'notificationIconUrlValue',
      faviconIconUrl: 'faviconIconUrlValue'
    });
  });

  afterAll(function () {
    TabNotification.handleChangeTitle.restore();
    $('body').removeData(['notificationIconUrl', 'faviconIconUrl']);
  });


  it('change the favicon and title', function() {
    tabNotification.changeTitle('test title', true);
    expect(tabNotification.handleChangeTitle).toHaveBeenCalledWith(
      ' \u2733 test title', 'notificationIconUrlValue'
    );
  });

  it('restore the favicon and title', function() {
    tabNotification.changeTitle('test title', false);
    expect(tabNotification.handleChangeTitle).toHaveBeenCalledWith(
      'test title', 'faviconIconUrlValue'
    );
  });
});
