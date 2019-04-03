import actionTypes from './actionTypes';

export const addNotification = (notification) => ({
  type: actionTypes.ADD_NOTIFICATION,
  notification
});

export const removeNotification = (id) => ({
  type: actionTypes.REMOVE_NOTIFICATION,
  id
});

export const sendSuccessNotification = (message) =>
  (dispatch, getState, { Notification }) => {
    const newNotification = Notification.createNotification({
      type: Notification.types.SUCCESS,
      message
    });

    dispatch(addNotification(newNotification));

    setTimeout(() => {
      dispatch(removeNotification(newNotification.id));
    }, 4000);
  }

export const sendErrorNotification = (message) =>
  (dispatch, getState, { Notification }) => {
    const newNotification = Notification.createNotification({
      type: Notification.types.ERROR,
      message
    });

    dispatch(addNotification(newNotification));
  }
