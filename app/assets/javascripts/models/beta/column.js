import * as iteration from "./iteration";

export const isChillyBin = (story) => {
  return story.state === "unscheduled";
};

export const isBacklog = (story, project) => {
  const currentIteration = iteration.getCurrentIteration(project);
  const storyIteration = iteration.getIterationForStory(story, project);
  const isFromCurrentSprint = currentIteration === storyIteration;
  return !isChillyBin(story) && (story.state !== "accepted" || isFromCurrentSprint);
};
