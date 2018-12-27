import actionTypes from './actionTypes';

export const receiveStories = (stories) => ({
  type: actionTypes.RECEIVE_STORIES,
  data: stories
});

export const toggleStory = (id) => ({
  type: actionTypes.TOGGLE_STORY,
  id
});

export const updateStorySuccess = (story) => ({
  type: actionTypes.UPDATE_STORY_SUCCESS,
  story
});

export const deleteStorySuccess = (id) => ({
  type: actionTypes.DELETE_STORY_SUCCESS,
  id
});

export const editStory = (id, newAttributes) => ({
  type: actionTypes.EDIT_STORY,
  id,
  newAttributes
});

export const updateStory = (story, projectId) => {
  return (dispatch, getState, { Story }) => {
    if (story._editing._isDirty) {
      return Story.update(story._editing, projectId)
        .then(( story ) => {
          dispatch(updateStorySuccess(story));
          dispatch(toggleStory(story.id));
        });
    }
    return dispatch(toggleStory(story.id));
  };
};

export const deleteStory = (storyId, projectId) => {
  return (dispatch, getState, { Story }) => {
    return Story.deleteStory(storyId, projectId)
      .then(dispatch(deleteStorySuccess(storyId)))
      .catch(error => {
        // TODO: dispatch an action to notify user on error
        alert(error.message);
      });
  };
};
