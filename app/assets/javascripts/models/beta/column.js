import * as iteration from './iteration';
import * as Story from './story';

export const isChillyBin = Story.isUnscheduled;

export const isBacklog = (story, project) => {
  const currentIteration = iteration.getCurrentIteration(project);
  const storyIteration = iteration.getIterationForStory(story, project);
  const isFromCurrentSprint = currentIteration === storyIteration;
  return (
    !isChillyBin(story) && (!Story.isAccepted(story) || isFromCurrentSprint)
  );
};

export const isDone = column => column === DONE;

export const isSearch = column => column === SEARCH;

export const order = (columns, reverse) =>
  reverse ? columns.reverse() : columns;

export const DONE = 'done';
export const BACKLOG = 'backlog';
export const CHILLY_BIN = 'chilly_bin';
export const SEARCH = 'search';
export const EPIC = 'epic';
export const ALL = 'all';

export const isDropDisabled = column => isDone(column) || isSearch(column);
