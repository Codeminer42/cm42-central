/* eslint import/prefer-default-export:"off" */
import actionTypes from './actionTypes';

export const receiveStories = (stories) => ({
  type: actionTypes.RECEIVE_STORIES,
  data: stories,
});
