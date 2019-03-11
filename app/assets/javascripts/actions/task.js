import actionTypes from './actionTypes';
import { setLoadingStory, storyFailure } from './story';

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

export const createTask = (projectId, storyId, task) =>
  async (dispatch, getState, { Task }) => {
    dispatch(setLoadingStory(storyId));

    try {
      const newTask = await Task.post(projectId, storyId, task);
      return dispatch(createTaskSuccess(newTask, storyId));
    }
    catch (error) {
      return dispatch(storyFailure(storyId, error));
    }
  };

export const deleteTask = (projectId, storyId, taskId) =>
  async (dispatch, getState, { Task }) => {
    dispatch(setLoadingStory(storyId));

    try {
      await Task.destroy(projectId, storyId, taskId);
      return dispatch(deleteTaskSuccess(taskId, storyId));
    }
    catch (error) {
      return dispatch(storyFailure(storyId, error));
    }
  };

export const toggleTask = (projectId, story, task, status) =>
  async (dispatch, getState, { Task }) => {
    try {
      const updatedTask = await Task.toggle(projectId, story.id, task.id, status);
      return dispatch(toggleTaskSuccess(updatedTask, story));
    }
    catch (error) {
      return dispatch(storyFailure(storyId, error));
    }
  };
