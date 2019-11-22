import actionTypes from "./actionTypes";
import { receiveUsers } from "./user";
import { receiveStories, toggleStory } from "./story";
import { receivePastIterations } from "./pastIterations";
import { storyScopes } from "../libs/beta/constants";
import { sendErrorNotification } from './notifications';

const requestProjectBoard = () => ({
  type: actionTypes.REQUEST_PROJECT_BOARD
});

const receiveProjectBoard = projectId => ({
  type: actionTypes.RECEIVE_PROJECT_BOARD,
  data: projectId
});

export const closeSearchSuccess = () => ({
  type: actionTypes.CLOSE_SEARCH
});

const errorRequestProjectBoard = error => ({
  type: actionTypes.ERROR_REQUEST_PROJECT_BOARD,
  error: error
});

const receiveProject = data => ({
  type: actionTypes.RECEIVE_PROJECT,
  data
});

const reverseColumns = () => ({
  type: actionTypes.REVERSE_COLUMNS
});

export const updateStorySuccess = (story, from) => ({
  type: actionTypes.UPDATE_STORY_SUCCESS,
  story,
  from
});

export const searchStoriesSuccess = keyWord => ({
  type: actionTypes.SEARCH_STORIES_SUCCESS,
  keyWord
});

export const updateLoadingSearch = loading => ({
  type: actionTypes.LOADING_SEARCH,
  loading
});

export const expandStoryIfNeeded = (dispatch, getHash) => {
  const storyId = getHash('#story-');

  if (storyId) {
    dispatch(toggleStory(parseInt(storyId)));
    window.history.pushState('', '/', window.location.pathname);
  }
}

export const sendErrorNotificationIfNeeded = (dispatch, code, condition) => {
  if (condition) dispatch(sendErrorNotification(code, { custom: true }));
}

export const reverseColumnsProjectBoard = () =>
  dispatch =>  dispatch(reverseColumns())

export const fetchProjectBoard = projectId =>
  async (dispatch, getState, { ProjectBoard, UrlService }) => {
    dispatch(requestProjectBoard());

    try {
      const {
        project, users,
        stories, pastIterations
      } = await ProjectBoard.get(projectId);

      dispatch(receiveProject(project));
      dispatch(receivePastIterations(pastIterations));
      dispatch(receiveUsers(users));
      dispatch(receiveStories(stories));
      dispatch(receiveProjectBoard(projectId));
      expandStoryIfNeeded(dispatch, UrlService.getHash);
    }
    catch (error) {
      console.error(error);
      return dispatch(errorRequestProjectBoard(error));
    }
  };

export const closeSearch = () =>
  dispatch => {
    dispatch(closeSearchSuccess());
    dispatch(receiveStories([], storyScopes.SEARCH));
  }

export const search = (keyWord, projectId) =>
  (dispatch, _, { Search }) => {
    Search.searchStories(keyWord, projectId, {
      onStart: () => dispatch(updateLoadingSearch(true)),
      onSuccess: result => {
        dispatch(updateLoadingSearch(false));
        dispatch(searchStoriesSuccess(keyWord));
        dispatch(receiveStories(result, 'search'));
        sendErrorNotificationIfNeeded(dispatch, 'projects.stories_not_found', !result.length);
      },
      onError: error => {
        dispatch(sendErrorNotification('messages.operations.error.default_error', { custom: true }));
        dispatch(updateLoadingSearch(false));
        console.error(error)
      }
    });
  };
