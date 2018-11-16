import { status, storyTypes } from "libs/beta/constants";

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
