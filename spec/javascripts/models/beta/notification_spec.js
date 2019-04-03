import * as Notification from 'models/beta/notification.js';

describe('Notification model', () => {
  describe('createNotification', () => {
    it('creates a new notification with an id and the same message/type', () => {
      const myNotification = { message: 'message', type: 'error' };

      const newNotification = Notification.createNotification(myNotification);

      expect(newNotification.id).not.toBeUndefined();
      expect(newNotification.message).toEqual(myNotification.message);
      expect(newNotification.type).toEqual(myNotification.type);
    });
  });

  describe('addNotification', () => {
    it('returns an array with the new notification', () => {
      const notifications = [
        { id: 1 },
        { id: 2 }
      ];

      const newNotification = { id: 3 };

      const expectedNotificationsArray = [newNotification, ...notifications];
      const newNotificationsArray = Notification.addNotification(notifications, newNotification);

      expect(newNotificationsArray).toEqual(expectedNotificationsArray);
    });
  });

  describe('removeNotification', () => {
    it('returns an array without the removed notification', () => {
      const notifications = [
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ];

      const removedNotificationId = 2;
      const expectedNotificationsArray = [{ id: 1 }, { id: 3 }];

      const newNotificationsArray = Notification.removeNotification(notifications, removedNotificationId);

      expect(newNotificationsArray).toEqual(expectedNotificationsArray);
    });
  });
});
