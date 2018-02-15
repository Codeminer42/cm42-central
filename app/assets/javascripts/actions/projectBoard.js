import ProjectBoard from 'models/projectBoard';
import actionTypes from './actionTypes';
import { receiveUsers } from './user';
import { receiveStories } from './story';

const requestProjectBoard = () => ({
  type: actionTypes.REQUEST_PROJECT_BOARD
});

const receiveProjectBoard = (projectId) => ({
  type: actionTypes.RECEIVE_PROJECT_BOARD,
  data: projectId
});

const errorRequestProjectBoard = (error) => ({
  type: actionTypes.ERROR_REQUEST_PROJECT_BOARD,
  error: error
});

const receiveProject = (project) => ({
  type: actionTypes.RECEIVE_PROJECT,
  data: project
});

export const fetchProjectBoard = (projectId) => {
  return (dispatch) => {
    dispatch(requestProjectBoard());

    const projectBoard = new ProjectBoard({ id: projectId });

    projectBoard.fetch()
      .then(({ project, users, stories }) => {
        dispatch(receiveProject(project));
        dispatch(receiveUsers(users));
        dispatch(receiveStories(stories));
        dispatch(receiveProjectBoard(projectId));
      })
      .catch((error) =>
        dispatch(errorRequestProjectBoard(error))
      );
  };
}
