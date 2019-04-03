import uuidv1 from 'uuid/v1';

export const createNotification = ({ type, message }) => ({
  id: uuidv1(),
  type,
  message
})

export const addNotification = (notifications, newNotification) =>
  [newNotification, ...notifications];

export const removeNotification = (notifications, id) =>
  notifications.filter(notification => notification.id !== id);

export const types = {
  SUCCESS: 'success',
  ERROR: 'error'
}
