import httpService from '../../services/httpService';
import changeCase from 'change-object-case';
import { updateIfSameId } from '../../services/updateIfSameId';

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

export const addTask = (story, task) => (
  {
    ...story,
    tasks: [
      ...story.tasks,
      task
    ]
  }
);

export const toggleTask = (story, changedTask) => {
  return {
    ...story,
    tasks: story.tasks.map(
      updateIfSameId(changedTask.id, task => {
        return {
          ...task,
          ...changedTask
        };
      }
    ))
  };
};

export const deleteTask = (taskId, story) => ({
  ...story,
  tasks: story.tasks.filter((task) => task.id !== taskId)
});
