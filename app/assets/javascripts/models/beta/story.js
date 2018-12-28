import { status, storyTypes } from "libs/beta/constants";
import httpService from '../../services/httpService';
import changeCase from 'change-object-case';

const compareValues = (a, b) => {
  if (a > b) return 1;

  if (a < b) return -1;

  return 0;
};

export const comparePosition = (a, b) => {
  const positionA = parseFloat(a.position);
  const positionB = parseFloat(b.position);

  return compareValues(positionA, positionB);
};

export const compareAcceptedAt = (a, b) => {
  return compareValues(a.acceptedAt, b.acceptedAt);
};

export const compareDeliveredAt = (a, b) => {
  return compareValues(a.deliveredAt, b.deliveredAt);
};

export const compareStartedAt = (a, b) => {
  return compareValues(a.startedAt, b.startedAt);
};

export const isUnestimatedFeature = story => {
  return story.estimate === null && story.storyType === storyTypes.FEATURE;
};

export const isFeature = story => {
  return story.storyType === storyTypes.FEATURE;
};

export const isUnscheduled = story => {
  return story.state === status.UNSCHEDULED;
};

export const isUnstarted = story => {
  return story.state === status.UNSTARTED;
};

export const isAccepted = story => {
  return story.state === status.ACCEPTED;
};

export const getPoints = story => {
  return isFeature(story) ? story.estimate : 0;
};

export const getCompletedPoints = story => {
  return isFeature(story) && isAccepted(story) ? story.estimate : 0;
};

export const isStoryNotEstimated = (storyType, estimate) => storyType === 'feature' && !estimate;

export const isRelease = (storyType) => storyType === 'release';

export const types = ['feature', 'bug', 'release', 'chore'];

export const update = (story, projectId) => {
  const newStory = changeCase.snakeKeys(story);

  return httpService
    .put(`/projects/${projectId}/stories/${story.id}`, newStory)
    .then(({ data }) => changeCase.camelKeys(data, { recursive: true, arrayRecursive: true }))
    .then(({ story }) => ({
      ...story,
      estimate: story.estimate || ''
    }));
};

export const deleteStory = (storyId, projectId) => {
  return httpService
    .delete(`/projects/${projectId}/stories/${storyId}`)
};

export const updateStory = (story, newAttributes) => {
  return {
    ...story,
    ...newAttributes
  };
};

export const toggleStory = (story) => {
  const editing = story.collapsed ? { ...story, _isDirty: false } : null;

  return {
    ...story,
    _editing: editing,
    collapsed: !story.collapsed
  };
};

export const editStory = (story, newAttributes) => {
  const newStory = {
    ...story._editing,
    ...newAttributes
  };

  newStory.estimate = isFeature(newStory) ? newStory.estimate : '';

  return {
    ...story,
    _editing: {
      ...newStory,
      _isDirty: true
    }
  };
};
