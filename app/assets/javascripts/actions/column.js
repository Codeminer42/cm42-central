import actionTypes from "./actionTypes";
import * as iteration from "../models/beta/iteration";

const setStoryChillyBin = payload => ({
  type: actionTypes.COLUMN_CHILLY_BIN,
  data: payload
});

const setStoryBacklog = (payload, project) => ({
  type: actionTypes.COLUMN_BACKLOG,
  data: payload,
  project: project
});

const setStoryDone = payload => ({
  type: actionTypes.COLUMN_DONE,
  data: payload
});

export const getColumnType = (story, project) => {
  if (story.state === "unscheduled") {
    return setStoryChillyBin(story);
  }
  if (isBacklog(story, project)) {
    return setStoryBacklog(story, project);
  }
  return setStoryDone(story);
};

const setColumn = (dispatch, project) => story => {
  var type = getColumnType(story, project);
  return dispatch(type);
};

const isBacklog = (story, project) => {
  const currentIteration = iteration.getCurrentIteration(project);
  const storyIteration = iteration.getIterationForStory(story, project);
  const isFromCurrentSprint = currentIteration === storyIteration;
  return story.state !== "accepted" || isFromCurrentSprint;
};

export const classifyStories = (dispatch, stories, project) =>
  stories.map(setColumn(dispatch, project));
