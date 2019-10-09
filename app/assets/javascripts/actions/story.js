import actionTypes from './actionTypes';
import { sendSuccessNotification, sendErrorNotification } from './notifications';

const defaultFrom = 'all';

export const createStory = (attributes, from = defaultFrom) => ({
  type: actionTypes.CREATE_STORY,
  attributes,
  from
});

export const addStory = (story, from = defaultFrom) => ({
  type: actionTypes.ADD_STORY,
  story,
  from
});

export const loadHistory = (title) => ({
  type: actionTypes.LOAD_HISTORY,
  title
})

export const receiveHistory = (activities, title) => ({
  type: actionTypes.RECEIVE_HISTORY,
  activities,
})

export const closeHistory = () => ({
  type: actionTypes.CLOSE_HISTORY
})

export const highlightStory = (storyId, highlight, from = defaultFrom) => ({
  type: actionTypes.HIGHLIGHT_STORY,
  storyId,
  highlight,
  from
});

export const errorLoadHistory = () => ({
  type: actionTypes.RECEIVE_HISTORY_ERROR
})

export const cloneStory = (story, from = defaultFrom) => ({
  type: actionTypes.CLONE_STORY,
  story,
  from
});

export const receiveStories = (stories, from = defaultFrom) => ({
  type: actionTypes.RECEIVE_STORIES,
  data: stories,
  from
});

export const updateStorySuccess = (story, from = defaultFrom) => ({
  type: actionTypes.UPDATE_STORY_SUCCESS,
  story,
  from
});

export const storyFailure = (id, error, from = defaultFrom) => ({
  type: actionTypes.STORY_FAILURE,
  id,
  error,
  from
});

export const deleteStorySuccess = (id, from = defaultFrom) => ({
  type: actionTypes.DELETE_STORY_SUCCESS,
  id,
  from
});

export const toggleStory = (id, from = defaultFrom) => ({
  type: actionTypes.TOGGLE_STORY,
  id,
  from
});

export const editStory = (id, newAttributes, from = defaultFrom) => ({
  type: actionTypes.EDIT_STORY,
  id,
  newAttributes,
  from
});

export const setLoadingStory = (id, from = defaultFrom) => ({
  type: actionTypes.SET_LOADING_STORY,
  id,
  from
});

export const showHistory = (storyId, from = defaultFrom) =>
  async (dispatch, getState, { Story }) => {
    const { stories } = getState();
    const story = Story.findById(stories[from], storyId)
    dispatch(loadHistory(story.title))
    try {
      const activities = await Story.getHistory(story.id, story.projectId)
      dispatch(receiveHistory(activities, story.title))
    }
    catch (error) {
      dispatch(sendErrorNotification(error))
      return dispatch(errorLoadHistory())
    }
  }

export const updateCollapsedStory = (storyId, projectId, newAttributes, from = defaultFrom) =>
  async (dispatch, getState, { Story }) => {
    const { stories } = getState();
    const story = Story.findById(stories[from], storyId);


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

export const saveStory = (storyId, projectId, options, from = defaultFrom) =>
  async (dispatch, getState, { Story }) => {
    const { stories } = getState();

    const story = Story.findById(stories[from], storyId);

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

        dispatch(updateStorySuccess(updatedStory, from));
        
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

export const deleteStory = (storyId, projectId, from = defaultFrom) =>
  async (dispatch, getState, { Story }) => {
    dispatch(setLoadingStory(storyId))
    try {
      const { stories } = getState();
      const storyTitle = Story.findById(stories[from], storyId).title;

      await Story.deleteStory(storyId, projectId);

      dispatch(deleteStorySuccess(storyId, from));

      return dispatch(sendSuccessNotification(
        I18n.t('messages.operations.success.story.delete', { story: storyTitle })
      ));
    }
    catch (error) {
      dispatch(sendErrorNotification(error))
      return dispatch(storyFailure(storyId, error))
    }
  }

export const highlight = storyId =>
  async (dispatch, getState, {}) => {
    try {
      dispatch(highlightStory(storyId, true));
      setTimeout(() => dispatch(highlightStory(storyId, false)), 400);
    } catch (error) {
      console.error(error)
    }
  }
