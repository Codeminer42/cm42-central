import actionTypes from './actionTypes';
import * as iteration from '../models/beta/iteration';

const setStoryChillyBin = (payload) => ({
  type: actionTypes.COLUMN_CHILLY_BIN,
  data: payload,
});

const setStoryBacklog = (payload) => ({
  type: actionTypes.COLUMN_BACKLOG,
  data: payload,
});

const setColumn = (dispatch, project) => story => {
  if(story.state === 'unscheduled') {
    return dispatch(setStoryChillyBin(story));
  }
  if(isBacklog(story, project)) {
    return dispatch(setStoryBacklog(story));
  }
}

const isBacklog = (story, project) => {
  const currentIteration = iteration.getCurrentIteration(project);
  const storyIteration = iteration.getIterationForStory(story, project);
  const isFromCurrentSprint = currentIteration === storyIteration;
  return story.state !== 'accepted' || isFromCurrentSprint
}

export const classifyStories = (dispatch, stories, project) => stories.map(setColumn(dispatch, project))
