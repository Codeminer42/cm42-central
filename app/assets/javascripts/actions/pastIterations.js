import actionTypes from './actionTypes';

export const receivePastIterations = (pastIterations) => ({
  type: actionTypes.RECEIVE_PAST_ITERATIONS,
  data: pastIterations
});
