import actionTypes from './actionTypes';

export const createStory = (attributes) => ({
  type: actionTypes.CREATE_STORY,
  attributes
});

export const addStory = (story) => ({
  type: actionTypes.ADD_STORY,
  story
});

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

export const storyFailure = (id, error) => ({
  type: actionTypes.STORY_FAILURE,
  id,
  error
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

export const setLoadingStory = (id) => ({
  type: actionTypes.SET_LOADING_STORY,
  id
});

export const saveStory = (storyId, projectId, options) =>
  (dispatch, getState, { Story }) => {
    const { stories } = getState();
    const story = stories.find((story) => story.id === storyId);

    dispatch(setLoadingStory(story.id))

    if (Story.isNew(story)) {
      return Story.post(story._editing, projectId)
        .then((story) =>
          dispatch(addStory(story))
        )
        .catch((error) => dispatch(storyFailure(story.id, error)));
    };

    if (story._editing._isDirty) {
      return Story.update(story._editing, projectId, options)
        .then((story) => {
          dispatch(updateStorySuccess(story))
        })
        .catch((error) => dispatch(storyFailure(story.id, error)))
    }

    return dispatch(toggleStory(story.id));
  };

export const deleteStory = (storyId, projectId) =>
  (dispatch, getState, { Story }) => {
    dispatch(setLoadingStory(storyId))
    return Story.deleteStory(storyId, projectId)
      .then(() => dispatch(deleteStorySuccess(storyId)))
      .catch((error) => {
        dispatch(storyFailure(storyId, error))
        // TODO: dispatch an action to notify user on error
        alert(error.message);
      });
  }
