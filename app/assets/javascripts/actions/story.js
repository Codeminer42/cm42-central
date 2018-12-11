import actionTypes from './actionTypes';

export const receiveStories = (stories) => ({
  type: actionTypes.RECEIVE_STORIES,
  data: stories
});

export const toggleStory = (id) => ({
  type: actionTypes.TOGGLE_STORY,
  id
});

export const editStory = (id, newAttributes) => ({
  type: actionTypes.EDIT_STORY,
  id,
  newAttributes
});
