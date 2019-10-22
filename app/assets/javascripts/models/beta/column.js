import * as iteration from "./iteration";
import * as Story from "./story";

export const isChillyBin = (story) => Story.isUnscheduled(story);

export const isBacklog = (story, project) => {
  const currentIteration = iteration.getCurrentIteration(project);
  const storyIteration = iteration.getIterationForStory(story, project);
  const isFromCurrentSprint = currentIteration === storyIteration;
  return !isChillyBin(story) && (!Story.isAccepted(story) || isFromCurrentSprint);
};

export const DONE = 'done';
export const BACKLOG = 'backlog';
export const CHILLY_BIN = 'chilly_bin';
