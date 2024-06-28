import actionTypes from 'actions/actionTypes';
import * as Notification from '../models/beta/notification';

const initialState = [];

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_NOTIFICATION:
      return Notification.addNotification(state, action.notification);
    case actionTypes.REMOVE_NOTIFICATION:
      return Notification.removeNotification(state, action.id);
    default:
      return state;
  }
};

export default notificationsReducer;
