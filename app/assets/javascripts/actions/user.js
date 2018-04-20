/* eslint import/prefer-default-export:"off" */
import actionTypes from './actionTypes';

export const receiveUsers = users => ({
  type: actionTypes.RECEIVE_USERS,
  data: users,
});
