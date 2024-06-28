import httpService from '../../services/httpService';
import changeCase from 'change-object-case';
import { updateIfSameId } from '../../services/updateIfSameId';
import { setLoadingValue } from './story';

export const post = async (projectId, storyId, task) => {
  const newTask = {
    name: task,
    done: false,
  };

  const { data } = await httpService.post(
    `/projects/${projectId}/stories/${storyId}/tasks`,
    newTask
  );

  return deserialize(data);
};

export const toggle = async (projectId, storyId, taskId, status) => {
  const taskStatus = serialize(status);

  const { data } = await httpService.put(
    `/projects/${projectId}/stories/${storyId}/tasks/${taskId}/`,
    taskStatus
  );

  return deserialize(data);
};

export const destroy = (projectId, storyId, taskId) =>
  httpService.delete(
    `/projects/${projectId}/stories/${storyId}/tasks/${taskId}`
  );

export const addTask = (story, task) => ({
  ...story,
  _editing: setLoadingValue(story._editing, false),
  tasks: [...story.tasks, task],
});

export const toggleTask = (story, changedTask) => ({
  ...story,
  tasks: story.tasks.map(
    updateIfSameId(changedTask.id, task => {
      return {
        ...task,
        ...changedTask,
      };
    })
  ),
});

export const deleteTask = (taskId, story) => ({
  ...story,
  _editing: setLoadingValue(story._editing, false),
  tasks: story.tasks.filter(task => task.id !== taskId),
});

const serialize = data =>
  changeCase.snakeKeys(data, {
    recursive: true,
    arrayRecursive: true,
  });

const deserialize = data =>
  changeCase.camelKeys(data, {
    recursive: true,
    arrayRecursive: true,
  });
