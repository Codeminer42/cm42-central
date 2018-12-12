import actionTypes from './actionTypes';
import * as Stories from "models/beta/story";

export const receiveStories = (stories) => ({
  type: actionTypes.RECEIVE_STORIES,
  data: stories
});

export const toggleStory = (id) => ({
  type: actionTypes.TOGGLE_STORY,
  id
});

export const updateStory = (story, projectId) => {
  return (dispatch) => {
    Stories.put(story, projectId);
  }
};

export const editStory = (id, newAttributes) => ({
  type: actionTypes.EDIT_STORY,
  id,
  newAttributes
});
