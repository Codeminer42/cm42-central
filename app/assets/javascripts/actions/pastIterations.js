import actionTypes from './actionTypes';
import { receiveStories } from './story';

export const receivePastIterations = (pastIterations) => ({
  type: actionTypes.RECEIVE_PAST_ITERATIONS,
  data: pastIterations
});

export const requestPastStories = iterationNumber => ({
  type: actionTypes.REQUEST_PAST_STORIES,
  iterationNumber
});

export const receivePastStories = (stories, iterationNumber) => ({
  type: actionTypes.RECEIVE_PAST_STORIES,
  iterationNumber,
  stories
});

export const errorRequestPastStories = (error, iterationNumber) => ({
  type: actionTypes.ERROR_REQUEST_PAST_STORIES,
  iterationNumber,
  error
}); 

export const fetchPastStories = (iterationNumber, startDate, endDate) => 
  async (dispatch, getState, { PastIteration }) => {
    const { project } = getState();

    dispatch(requestPastStories(iterationNumber));

    try {
      const stories = await PastIteration.getStories(
        project.id,
        startDate,
        endDate
      );

      dispatch(receivePastStories(stories, iterationNumber));
    } catch (error) {
      dispatch(errorRequestPastStories(error, iterationNumber));
    }
  };
