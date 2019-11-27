import actionTypes from './actionTypes';
import status from 'http-status';

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

export const sendErrorNotification = (error, { custom = false } = {}) => {
  if (error.response) return sendServerErrorNotification(error);
  if (custom) return sendCustomErrorNotification(error);
  return sendDefaultErrorNotification();
}

export const sendCustomErrorNotification = code =>
  (dispatch, _, { Notification }) =>
    dispatch(
      addNotification(
        Notification.createNotification({
          type: Notification.types.ERROR,
          message: I18n.t(code)
        })
      )
    );

const sendServerErrorNotification = (error) =>
  (dispatch, getState, { Notification }) => {
    const type = Notification.types.ERROR;

    switch (error.response.status) {
      case status.UNPROCESSABLE_ENTITY:
        return dispatch(
          addValidationNotifications(error.response.data.story.errors)
        );
      case status.UNAUTHORIZED:
        return dispatch(
          addNotification(
            Notification.createNotification({
              type,
              message: I18n.t('users.You are not authorized to perform this action')
            })
          )
        );
      case status.NOT_FOUND:
        return dispatch(
          addNotification(
            Notification.createNotification({
              type,
              message: I18n.t('not_found')
            })
          )
        );
      default:
        return dispatch(
          addDefaultErrorNotification(Notification)
        );
    }
  }

export const sendDefaultErrorNotification = () =>
  (dispatch, getState, { Notification }) =>
    dispatch(
      addDefaultErrorNotification(Notification)
    );

const addDefaultErrorNotification = Notification =>
  addNotification(
    Notification.createNotification({
      type: Notification.types.ERROR,
      message: I18n.t('messages.operations.error.default_error')
    })
  )

export const addValidationNotifications = (errors) =>
  (dispatch, getState, { Notification }) => {
    const notifications = Object.keys(errors).map(error =>
      Notification.createNotification({
        type: Notification.types.ERROR,
        message: `Error. ${error}: ${errors[error]}`
      })
    );

    dispatch(addNotification(notifications));
  }
