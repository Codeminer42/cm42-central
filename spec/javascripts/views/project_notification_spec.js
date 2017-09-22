var TabNotification = require('mixins/tab_notification');

describe('Project Notification', function() {
  var tabNotification = TabNotification;

  sinon.stub(TabNotification, 'handleChangeTitle');

  it('change the favicon and title', function() {
    tabNotification.changeTitle('test title', true);
    expect(tabNotification.handleChangeTitle).toHaveBeenCalledWith(
      ' \u2733 test title', '/assets/notification.ico'
    );
  });

  it('restore the favicon and title', function() {
    tabNotification.changeTitle('test title', false);
    expect(tabNotification.handleChangeTitle).toHaveBeenCalledWith(
      'test title', '/assets/favicon.ico'
    );
  });
});
