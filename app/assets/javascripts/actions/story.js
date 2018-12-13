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
})

export const updateStory = (story, projectId) => {
  return (dispatch , getState, { Story }) => {
    if (story._editing._isDirty) {
      Story.update(story._editing, projectId)
        .then(( story ) => {
          dispatch(updateStorySuccess(story))
        });
    }
    dispatch(toggleStory(story.id))
  }
};

export const editStory = (id, newAttributes) => ({
  type: actionTypes.EDIT_STORY,
  id,
  newAttributes
});
