import TabNotification from 'mixins/tab_notification';

describe('Project Notification', function () {
  let tabNotificationHandleChange;

  beforeAll(function () {
    tabNotificationHandleChange = vi.spyOn(
      TabNotification,
      'handleChangeTitle'
    );
    $('body').data({
      notificationIconUrl: 'notificationIconUrlValue',
      faviconIconUrl: 'faviconIconUrlValue',
    });
  });

  afterAll(function () {
    TabNotification.handleChangeTitle.mockRestore();
    $('body').removeData(['notificationIconUrl', 'faviconIconUrl']);
  });

  it('change the favicon and title', function () {
    TabNotification.changeTitle('test title', true);
    expect(tabNotificationHandleChange).toHaveBeenCalledWith(
      ' \u2733 test title',
      'notificationIconUrlValue'
    );
  });

  it('restore the favicon and title', function () {
    TabNotification.changeTitle('test title', false);
    expect(tabNotificationHandleChange).toHaveBeenCalledWith(
      'test title',
      'faviconIconUrlValue'
    );
  });
});
