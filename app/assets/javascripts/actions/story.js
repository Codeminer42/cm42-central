import actionTypes from './actionTypes';

export const receiveStories = (stories) => ({
  type: actionTypes.RECEIVE_STORIES,
  data: stories
});

export const toggleStory = (id) => ({
  type: actionTypes.TOGGLE_STORY,
  id
});
