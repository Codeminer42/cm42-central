import actionTypes from "actions/actionTypes";
import { normalizePastIterations } from "../models/beta/pastIteration";

const initialState = {};

const pastIterationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_PAST_ITERATIONS:
      return normalizePastIterations(
        action.data.map((iteration) => {
          const currentState =
            state.pastIterations?.byId[iteration.iterationNumber];

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
      return {
        ...state,
        pastIterations: {
          ...state.pastIterations,
          byId: {
            ...state.pastIterations.byId,
            [action.iterationNumber]: {
              ...state.pastIterations.byId[action.iterationNumber],
              isFetching: true,
            },
          },
        },
      };
    case actionTypes.RECEIVE_PAST_STORIES:
      return {
        ...state,
        pastIterations: {
          ...state.pastIterations,
          byId: {
            ...state.pastIterations.byId,
            [action.iterationNumber]: {
              ...state.pastIterations.byId[action.iterationNumber],
              fetched: true,
              isFetching: false,
              storyIds: action.stories.map((story) => story.id),
            },
          },
        },
      };
    case actionTypes.ERROR_REQUEST_PAST_STORIES:
      return {
        ...state,
        pastIterations: {
          ...state.pastIterations,
          byId: {
            ...state.pastIterations.byId,
            [action.iterationNumber]: {
              ...state.pastIterations.byId[action.iterationNumber],
              fetched: false,
              isFetching: false,
              error: action.error,
            },
          },
        },
      };
    default:
      return state;
  }
};

export default pastIterationsReducer;
