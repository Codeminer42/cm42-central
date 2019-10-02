import { every, has } from 'underscore';

export const isDone = sprint => has(sprint, 'hasStories');

const isAllDone = sprints => every(sprints, isDone);

export const sortSprints = sprints => 
  isAllDone(sprints) ? sprints.reverse() : sprints
