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
  } else {
    const currentSprint = iteration.getSprint(project);
    const storySprint = iteration.getIterationForStory(story, project);
    const isFromCurrentSprint = currentSprint === storySprint;
    if(story.state !== 'accepted' || isFromCurrentSprint) {
      return dispatch(setStoryBacklog(story));
    }
  }
}

export const classifyStories = (dispatch, stories, project) => stories.map(setColumn(dispatch, project))
