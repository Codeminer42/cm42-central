import actionTypes from './actionTypes';
import { sendSuccessNotification, sendErrorNotification } from './notifications';
import { 
  toggleSearchStory, editSearchStory, setLoadingSearchStory,
  updateStorySearchSuccess 
} from './projectBoard';

export const createStory = (attributes) => ({
  type: actionTypes.CREATE_STORY,
  attributes
});

export const addStory = (story) => ({
  type: actionTypes.ADD_STORY,
  story
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

export const closeSearchSuccess = () => ({
  type: actionTypes.CLOSE_SEARCH
})

export const focusStory = storyId => ({
  type: actionTypes.FOCUS_STORY,
  storyId
})

export const removeFocusStory = storyId => ({
  type: actionTypes.REMOVE_FOCUS_STORY,
  storyId
})

export const errorLoadHistory = () => ({
  type: actionTypes.RECEIVE_HISTORY_ERROR
})

export const cloneStory = (story) => ({
  type: actionTypes.CLONE_STORY,
  story
});

export const receiveStories = (stories) => ({
  type: actionTypes.RECEIVE_STORIES,
  data: stories
});

export const updateStorySuccess = (story) => ({
  type: actionTypes.UPDATE_STORY_SUCCESS,
  story
});

export const searchStoriesSuccess = search => ({
  type: actionTypes.SEARCH_STORIES_SUCCESS,
  search
})

export const storyFailure = (id, error) => ({
  type: actionTypes.STORY_FAILURE,
  id,
  error
});

export const deleteStorySuccess = (id) => ({
  type: actionTypes.DELETE_STORY_SUCCESS,
  id
});

export const toggleStoryDefault = id => ({
  type: actionTypes.TOGGLE_STORY,
  id
});

export const editStoryDefault = (id, newAttributes) => ({
  type: actionTypes.EDIT_STORY,
  id,
  newAttributes
});

export const setLoadingStoryDefault = id => ({
  type: actionTypes.SET_LOADING_STORY,
  id
});

export const setLoadingStory = (id, from = '') =>
  async (dispatch, getState, {}) => {
    try {
      switch (from) {
        case 'search': return dispatch(setLoadingSearchStory(id));
        default: return dispatch(setLoadingStoryDefault(id));
      }
    } catch (error) {
      console.error(error);
    }
  }

export const editStory = (id, newAttributes, from = '') =>
  async (dispatch, getState, {}) => {
    try {
      switch (from) {
        case 'search': return dispatch(editSearchStory(id, newAttributes));
        default: return dispatch(editStoryDefault(id, newAttributes));
      }
    } catch (error) {
      console.error(error);
    }
  }

export const toggleStory = (id, from = '') => {
  switch (from) {
    case 'search': return toggleSearchStory(id)
    default: return toggleStoryDefault(id)
  }
}

export const showHistory = (storyId) =>
  async (dispatch, getState, { Story }) => {
    const { stories } = getState();
    const story = Story.findById(stories, storyId)
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

export const updateCollapsedStory = (storyId, projectId, newAttributes) =>
  async (dispatch, getState, { Story }) => {
    const { stories } = getState();
    const story = Story.findById(stories, storyId);


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

export const saveStory = (storyId, projectId, options, from = '') =>
  async (dispatch, getState, { Story }) => {
    const { stories, projectBoard } = getState();

    let story;

    switch (from) {
      case 'search':
        story = Story.findById(projectBoard.search.result, storyId)
        break;

      default: 
        story = Story.findById(stories, storyId)
    }

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

        switch (from) {
          case 'search': 
            dispatch(updateStorySearchSuccess(updatedStory));
            break;
        }

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
      const storyTitle = Story.findById(stories, storyId).title;

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

export const search = (keyWord, projectId) =>
  async (dispatch, getState, { ProjectBoard }) => {
    try {
      const search = await ProjectBoard.searchStories(keyWord, projectId);

      dispatch(searchStoriesSuccess(search));
    }
    catch (error) {
      console.error(error)
    }
  };

export const closeSearch = () =>
  async (dispatch, getState, {}) => {
    try {
      dispatch(closeSearchSuccess());
    } catch (error) {
      console.error(error)
    }
  }

export const highlight = storyId =>
  async (dispatch, getState, {}) => {
    try {
      dispatch(focusStory(storyId));
      setTimeout(() => dispatch(removeFocusStory(storyId)), 400);
    } catch (error) {
      console.error(error)
    }
  }
