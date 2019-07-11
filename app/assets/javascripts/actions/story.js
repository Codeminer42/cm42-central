import actionTypes from './actionTypes';
import { sendSuccessNotification, sendErrorNotification } from './notifications';

export const createStory = (attributes) => ({
  type: actionTypes.CREATE_STORY,
  attributes
});

export const addStory = (story) => ({
  type: actionTypes.ADD_STORY,
  story
});

export const updateHistory = (id, history) => ({
  type: actionTypes.UPDATE_HISTORY,
  id,
  history
})

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

export const showHistory = (story) =>
  async (dispatch, getState, { Story }) => {
    const history = await Story.getHistory(story.id, story.projectId)
    dispatch(updateHistory(story.id, history))
  }

export const updateCollapsedStory = (storyId, projectId, newAttributes) =>
  async (dispatch, getState, { Story }) => {
    const { stories } = getState();
    const story = stories.find((story) => story.id === storyId);

    const newStory = { ...story, ...newAttributes };

    try {
      const updatedStory = await Story.update(newStory, projectId);

      dispatch(updateStorySuccess(updatedStory))

      return dispatch(sendSuccessNotification(
        I18n.t('messages.operations.success.story.save', { story: updatedStory.title })
      ));
    }
    catch (error) {
      dispatch(sendErrorNotification(error))
      return dispatch(storyFailure(story.id, error))
    }
  }

export const saveStory = (storyId, projectId, options) =>
  async (dispatch, getState, { Story }) => {
    const { stories } = getState();
    const story = stories.find((story) => story.id === storyId);

    dispatch(setLoadingStory(story.id));

    if (Story.isNew(story)) {
      try {
        const newStory = await Story.post(story._editing, projectId)

        dispatch(addStory(newStory));

        return dispatch(sendSuccessNotification(
          I18n.t('messages.operations.success.story.create', { story: story._editing.title })
        ));
      }
      catch (error) {
        dispatch(sendErrorNotification(error))
        return dispatch(storyFailure(story.id, error))
      }
    };

    if (story._editing._isDirty) {
      try {
        const updatedStory = await Story.update(story._editing, projectId, options);

        dispatch(updateStorySuccess(updatedStory));

        return dispatch(sendSuccessNotification(
          I18n.t('messages.operations.success.story.save', { story: updatedStory.title })
        ));
      }
      catch (error) {
        dispatch(sendErrorNotification(error))
        return dispatch(storyFailure(story.id, error))
      }
    }

    return dispatch(toggleStory(story.id));
  };

export const deleteStory = (storyId, projectId) =>
  async (dispatch, getState, { Story }) => {
    dispatch(setLoadingStory(storyId))
    try {
      const { stories } = getState();
      const storyTitle = stories.find(story => story.id === storyId).title;

      await Story.deleteStory(storyId, projectId);

      dispatch(deleteStorySuccess(storyId));

      return dispatch(sendSuccessNotification(
        I18n.t('messages.operations.success.story.delete', { story: storyTitle })
      ));
    }
    catch (error) {
      dispatch(sendErrorNotification(error))
      return dispatch(storyFailure(storyId, error))
    }
  }
