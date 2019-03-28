import actionTypes from './actionTypes';

export const createStory = (attributes) => ({
  type: actionTypes.CREATE_STORY,
  attributes
});

export const addStory = (story) => ({
  type: actionTypes.ADD_STORY,
  story
});

export const cloneStory = (story) => ({
  type: actionTypes.CLONE_STORY,
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

export const updateCollapsedStory = (storyId, projectId, newAttributes) =>
  (dispatch, getState, { Story }) => {
    const { stories } = getState();
    const story = stories.find((story) => story.id === storyId);

    const newStory = { ...story, ...newAttributes };

    return Story.update(newStory, projectId)
      .then((story) => {
        dispatch(updateStorySuccess(story));
      });
  }

export const saveStory = (storyId, projectId, options) =>
  async (dispatch, getState, { Story }) => {
    const { stories } = getState();
    const story = stories.find((story) => story.id === storyId);

    dispatch(setLoadingStory(story.id))

    if (Story.isNew(story)) {
      try {
        const newStory = await Story.post(story._editing, projectId)
        return dispatch(addStory(newStory))
      }
      catch (error) {
        return dispatch(storyFailure(story.id, error))
      }
    };

    if (story._editing._isDirty) {
      try {
        const updatedStory = await Story.update(story._editing, projectId, options)
        return dispatch(updateStorySuccess(updatedStory))
      }
      catch (error) {
        return dispatch(storyFailure(story.id, error))
      }
    }

    return dispatch(toggleStory(story.id));
  };

export const deleteStory = (storyId, projectId) =>
  async (dispatch, getState, { Story }) => {
    dispatch(setLoadingStory(storyId))

    try {
      await Story.deleteStory(storyId, projectId);
      return dispatch(deleteStorySuccess(storyId));
    }
    catch (error) {
      return dispatch(storyFailure(storyId, error))
    }
  }
