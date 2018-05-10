import actionTypes from './actionTypes';

const setStoryChillyBin = (payload) => ({
  type: actionTypes.COLUMN_CHILLY_BIN,
  data: payload,
});

const setStoryBacklog = (payload) => ({
  type: actionTypes.COLUMN_BACKLOG,
  data: payload,
});

const setStoryInProgress = (payload) => ({
  type: actionTypes.COLUMN_IN_PROGRESS,
  data: payload,
});

const setColumn = dispatch => story => {
  switch(story.state) {
    case 'unscheduled':
      dispatch(setStoryChillyBin(story));
      break;
    case 'unstarted':
      dispatch(setStoryBacklog(story));
      break;
    case 'accepted':
      // to do
      break;
    default :
      dispatch(setStoryInProgress(story));
  }
}

export const classifyStories = (dispatch, stories) => stories.map(setColumn(dispatch))
