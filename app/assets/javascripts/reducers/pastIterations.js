import actionTypes from "actions/actionTypes";
import {
  denormalizePastIterations,
  normalizePastIterations,
} from "../models/beta/pastIteration";

const initialState = {};

const pastIterationsReducer = (state = initialState, action) => {
  const denormalizedPastIterations = denormalizePastIterations(state);

  switch (action.type) {
    case actionTypes.RECEIVE_PAST_ITERATIONS:
      return normalizePastIterations(
        action.data.map((iteration) => {
          const currentState = denormalizedPastIterations.find(
            (currentIteration) =>
              currentIteration.iterationNumber === iteration.iterationNumber
          );
          if (currentState?.fetched) {
            return {
              ...iteration,
              error: null,
              storyIds: currentState.storyIds,
              fetched: true,
              isFetching: false,
              stories: undefined,
            };
          }
          return {
            ...iteration,
            error: null,
            storyIds: [],
            fetched: false,
            isFetching: false,
            stories: undefined,
          };
        })
      );
    case actionTypes.REQUEST_PAST_STORIES:
      return normalizePastIterations(
        denormalizedPastIterations.map((iteration) => {
          if (iteration.iterationNumber === action.iterationNumber) {
            return { ...iteration, isFetching: true };
          }
          return iteration;
        })
      );
    case actionTypes.RECEIVE_PAST_STORIES:
      return normalizePastIterations(
        denormalizedPastIterations.map((iteration) => {
          if (iteration.iterationNumber === action.iterationNumber) {
            return {
              ...iteration,
              fetched: true,
              isFetching: false,
              storyIds: action.stories.map((story) => story.id),
            };
          }
          return iteration;
        })
      );
    case actionTypes.ERROR_REQUEST_PAST_STORIES:
      return normalizePastIterations(
        denormalizedPastIterations.map((iteration) => {
          if (iteration.iterationNumber === action.iterationNumber) {
            return {
              ...iteration,
              fetched: false,
              isFetching: false,
              error: action.error,
            };
          }
          return iteration;
        })
      );
    default:
      return state;
  }
};

export default pastIterationsReducer;
