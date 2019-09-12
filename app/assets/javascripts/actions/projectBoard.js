import actionTypes from "./actionTypes";
import { receiveUsers } from "./user";
import { receiveStories, toggleStory } from "./story";
import { receivePastIterations } from "./pastIterations";

const requestProjectBoard = () => ({
  type: actionTypes.REQUEST_PROJECT_BOARD
});

const receiveProjectBoard = projectId => ({
  type: actionTypes.RECEIVE_PROJECT_BOARD,
  data: projectId
});

const errorRequestProjectBoard = error => ({
  type: actionTypes.ERROR_REQUEST_PROJECT_BOARD,
  error: error
});

const receiveProject = data => ({
  type: actionTypes.RECEIVE_PROJECT,
  data
});

export const expandStoryIfNeeded = (dispatch, getHash) => {
  const storyId = getHash('#story-');

  if (storyId) {
    dispatch(toggleStory(storyId));
    window.history.pushState('', '/', window.location.pathname);
  }
}

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
