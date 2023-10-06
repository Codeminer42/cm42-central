import actionTypes from "actions/actionTypes";

const initialState = [];

const pastIterationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_PAST_ITERATIONS:
      return action.data.map((iteration) => {
        const currentState = state.find(
          (currentIteration) =>
            currentIteration.iterationNumber === iteration.iterationNumber
        );
        if (currentState && currentState.fetched) {
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
      });
    case actionTypes.REQUEST_PAST_STORIES:
      return state.map((iteration) => {
        if (iteration.iterationNumber === action.iterationNumber) {
          return { ...iteration, isFetching: true };
        }
        return iteration;
      });
    case actionTypes.RECEIVE_PAST_STORIES:
      return state.map((iteration) => {
        if (iteration.iterationNumber === action.iterationNumber) {
          return {
            ...iteration,
            fetched: true,
            isFetching: false,
            storyIds: action.stories.map((story) => story.id),
          };
        }
        return iteration;
      });
    case actionTypes.ERROR_REQUEST_PAST_STORIES:
      return state.map((iteration) => {
        if (iteration.iterationNumber === action.iterationNumber) {
          return {
            ...iteration,
            fetched: false,
            isFetching: false,
            error: action.error,
          };
        }
        return iteration;
      });
    default:
      return state;
  }
};

export default pastIterationsReducer;
