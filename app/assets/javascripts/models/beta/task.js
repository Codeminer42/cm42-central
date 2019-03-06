import httpService from '../../services/httpService';
import PropTypes from 'prop-types';
import changeCase from 'change-object-case';
import { updateIfSameId } from '../../services/updateIfSameId';
import { setLoadingValue } from './story';

export const post = (projectId, storyId, task) => {
  const newTask = {
    name: task,
    done: false
  }
  return httpService
    .post(`/projects/${projectId}/stories/${storyId}/tasks`, newTask)
    .then(({ data }) => changeCase.camelKeys(data, { recursive: true, arrayRecursive: true }));
};

export const toggle = (projectId, storyId, taskId, status) => {
  const taskStatus = changeCase.snakeKeys(status);
  return httpService
    .put(`/projects/${projectId}/stories/${storyId}/tasks/${taskId}/`, taskStatus)
    .then(({ data }) => changeCase.camelKeys(data, { recursive: true, arrayRecursive: true }));
};

export const destroy = (projectId, storyId, taskId) => {
  return httpService
    .delete(`/projects/${projectId}/stories/${storyId}/tasks/${taskId}`);
};

export const addTask = (story, task) => ({
  ...story,
  _editing: setLoadingValue(story._editing, false),
  tasks: [
    ...story.tasks,
    task
  ]
});

export const toggleTask = (story, changedTask) => ({
  ...story,
  tasks: story.tasks.map(
    updateIfSameId(changedTask.id, task => {
      return {
        ...task,
        ...changedTask
      };
    }
    ))
});

export const deleteTask = (taskId, story) => ({
  ...story,
  _editing: setLoadingValue(story._editing, false),
  tasks: story.tasks.filter((task) => task.id !== taskId)
});

export const taskPropTypesShape = PropTypes.shape({
  id: PropTypes.number,
  storyId: PropTypes.number,
  name: PropTypes.string,
  done: PropTypes.bool,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string
});
