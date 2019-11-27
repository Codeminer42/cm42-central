import actionTypes from './actionTypes';
import { sendSuccessNotification, sendErrorNotification } from './notifications';

export const createStory = (attributes, from) => ({
  type: actionTypes.CREATE_STORY,
  attributes,
  from
});

export const addStory = (story, from) => ({
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

export const updateHighlight = (storyId, highlighted, from) => ({
  type: actionTypes.HIGHLIGHT_STORY,
  storyId,
  highlighted,
  from
});

export const errorLoadHistory = () => ({
  type: actionTypes.RECEIVE_HISTORY_ERROR
})

export const cloneStory = (story, from) => ({
  type: actionTypes.CLONE_STORY,
  story,
  from
});

export const receiveStories = (stories, from) => ({
  type: actionTypes.RECEIVE_STORIES,
  data: stories,
  from
});

export const updateStorySuccess = (story, from) => ({
  type: actionTypes.UPDATE_STORY_SUCCESS,
  story,
  from
});

export const storyFailure = (id, error, from) => ({
  type: actionTypes.STORY_FAILURE,
  id,
  error,
  from
});

export const deleteStorySuccess = (id, from) => ({
  type: actionTypes.DELETE_STORY_SUCCESS,
  id,
  from
});

export const toggleStory = (id, from) => ({
  type: actionTypes.TOGGLE_STORY,
  id,
  from
});

export const editStory = (id, newAttributes, from) => ({
  type: actionTypes.EDIT_STORY,
  id,
  newAttributes,
  from
});

export const setLoadingStory = (id, from) => ({
  type: actionTypes.SET_LOADING_STORY,
  id,
  from
});

export const confirmBeforeSaveIfNeeded = async (story, confirm, needConfirmation, callback) => {
  const confirmStoryChange = story => confirm(
    I18n.t('story.definitive_sure', { 
      action: I18n.t('story.change_to', { state: I18n.t(`story.state.${story.state}`) }) 
    })
  );

  if (!needConfirmation(story) || confirmStoryChange(story)) {
    try {
      await callback.onConfirmed();
    }
    catch (error) {
      callback.onError(error);
    }
  } else {
    callback.onCanceled();
  }
}

export const showHistory = (storyId, from) =>
  async (dispatch, getState, { Story }) => {
    const { stories } = getState();
    const story = Story.findById(Story.withScope(stories, from), storyId)
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

export const updateCollapsedStory = (storyId, projectId, newAttributes, from) =>
  async (dispatch, getState, { Story }) => {
    const { stories } = getState();
    const story = Story.findById(Story.withScope(stories, from), storyId);
    const newStory = { ...story, ...newAttributes };

    return await confirmBeforeSaveIfNeeded(newStory, window.confirm, Story.needConfirmation, {
      onConfirmed: async () => {
        const updatedStory = await Story.update(newStory, projectId);

        dispatch(updateStorySuccess(updatedStory, from))

        dispatch(sendSuccessNotification(
          I18n.t('messages.operations.success.story.save', { story: updatedStory.title })
        ));
      },
      onError: (error) => {
        dispatch(sendErrorNotification(error))
        dispatch(storyFailure(story.id, error, from))
      },
      onCanceled: () => {
        dispatch(sendErrorNotification('messages.operations.cancel.default_cancel', { custom: true }))
        dispatch(storyFailure(story.id, I18n.t('messages.operations.cancel.default_cancel'), from))
      }
    });
  }

export const saveStory = (storyId, projectId, from, options) =>
  async (dispatch, getState, { Story }) => {
    const { stories } = getState();

    const story = Story.findById(Story.withScope(stories, from), storyId);

    dispatch(setLoadingStory(story.id, from));

    if (Story.isNew(story)) {
      return await confirmBeforeSaveIfNeeded(story._editing, window.confirm, Story.needConfirmation, {
        onConfirmed: async () => {
          const newStory = await Story.post(story._editing, projectId)

          dispatch(addStory(newStory, from));
          dispatch(sendSuccessNotification(
            I18n.t('messages.operations.success.story.create', { story: story._editing.title })
          ));
        },
        onError: (error) => {
          dispatch(sendErrorNotification(error))
          dispatch(storyFailure(story.id, error, from))
        },
        onCanceled: () => {
          dispatch(sendErrorNotification('messages.operations.cancel.default_cancel', { custom: true }))
          dispatch(storyFailure(story.id, I18n.t('messages.operations.cancel.default_cancel'), from))
        }
      });
    };

    if (story._editing._isDirty) {
      return await confirmBeforeSaveIfNeeded(story._editing, window.confirm, Story.needConfirmation, {
        onConfirmed: async () => {
          const updatedStory = await Story.update(story._editing, projectId, options);

          dispatch(updateStorySuccess(updatedStory, from));
          dispatch(sendSuccessNotification(
            I18n.t('messages.operations.success.story.save', { story: updatedStory.title })
          ));
        },
        onError: (error) => {
          dispatch(sendErrorNotification(error))
          dispatch(storyFailure(story.id, error, from))
        },
        onCanceled: () => {
          dispatch(sendErrorNotification('messages.operations.cancel.default_cancel', { custom: true }))
          dispatch(storyFailure(story.id, I18n.t('messages.operations.cancel.default_cancel'), from))
        }
      });
    }

    return dispatch(toggleStory(story.id, from));
  };

export const deleteStory = (storyId, projectId, from) =>
  async (dispatch, getState, { Story }) => {
    dispatch(setLoadingStory(storyId, from))
    try {
      const { stories } = getState();
      const storyTitle = Story.findById(Story.withScope(stories, from), storyId).title;

      await Story.deleteStory(storyId, projectId);

      dispatch(deleteStorySuccess(storyId, from));

      return dispatch(sendSuccessNotification(
        I18n.t('messages.operations.success.story.delete', { story: storyTitle })
      ));
    }
    catch (error) {
      dispatch(sendErrorNotification(error))
      return dispatch(storyFailure(storyId, error, from))
    }
  }

export const highlight = storyId =>
  dispatch => {
    dispatch(updateHighlight(storyId, true));
    setTimeout(() => dispatch(updateHighlight(storyId, false)), 400);
  }
