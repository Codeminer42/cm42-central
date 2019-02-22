import actionTypes from './actionTypes';

export const createTaskSuccess = (task, storyId) => ({
  type: actionTypes.ADD_TASK,
  task,
  storyId
});

export const deleteTaskSuccess = (task, storyId) => ({
  type: actionTypes.REMOVE_TASK,
  task,
  storyId
});

export const toggleTaskSuccess = (task, story) => ({
  type: actionTypes.TOGGLE_TASK,
  task,
  story
});

export const createTask = (projectId, storyId, task) => {
  return (dispatch, getState, { Task }) => {
    return Task.post(projectId, storyId, task)
      .then((task) => dispatch(createTaskSuccess(task, storyId)))
      .catch((error) => console.error(error));
  };
};

export const deleteTask = (projectId, storyId, taskId) => {
  return (dispatch, getState, { Task }) => {
    return Task.destroy(projectId, storyId, taskId)
      .then(() => dispatch(deleteTaskSuccess(taskId, storyId)))
      .catch((error) => console.error(error));
  };
};

export const toggleTask = (projectId, story, task, status) => {
  return (dispatch, getState, { Task }) => {
    return Task.toggle(projectId, story.id, task.id, status)
      .then((task) => dispatch(toggleTaskSuccess(task, story)))
      .catch((error) => console.error(error));
  };
};
