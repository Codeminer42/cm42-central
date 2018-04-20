/* eslint import/prefer-default-export:"off" */
import * as ProjectBoard from 'models/projectBoard';
import actionTypes from './actionTypes';
import { receiveUsers } from './user';
import { receiveStories } from './story';

const requestProjectBoard = () => ({
  type: actionTypes.REQUEST_PROJECT_BOARD,
});

const receiveProjectBoard = (projectId) => ({
  type: actionTypes.RECEIVE_PROJECT_BOARD,
  data: projectId,
});

const errorRequestProjectBoard = (error) => ({
  type: actionTypes.ERROR_REQUEST_PROJECT_BOARD,
  error,
});

const receiveProject = (project) => ({
  type: actionTypes.RECEIVE_PROJECT,
  data: project,
});

export const fetchProjectBoard = (projectId) => (dispatch) => {
  dispatch(requestProjectBoard());

  return ProjectBoard.get(projectId)
    .then(({ project, users, stories }) => {
      dispatch(receiveProject(project));
      dispatch(receiveUsers(users));
      dispatch(receiveStories(stories));
      dispatch(receiveProjectBoard(projectId));
    })
    .catch((error) =>
      dispatch(errorRequestProjectBoard(error)));
};
