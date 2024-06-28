import actionTypes from 'actions/actionTypes';

const initialState = {};

const pastIterationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_PAST_ITERATIONS:
      return normalizePastIterations(
        action.data.map(iteration => {
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
              storyIds: action.stories.map(story => story.id),
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

const normalizePastIterations = pastIterations => {
  return pastIterations.reduce(
    (acc, pastIteration) => {
      const pastIterationId = pastIteration.iterationNumber;

      acc.pastIterations.byId[pastIterationId] = { ...pastIteration };
      acc.pastIterations.allIds.push(pastIterationId);

      return acc;
    },
    {
      pastIterations: {
        byId: {},
        allIds: [],
      },
    }
  );
};

export const denormalizePastIterations = pastIterations => {
  const normalizedPastIterations = pastIterations?.pastIterations;

  if (
    !normalizedPastIterations ||
    normalizedPastIterations.allIds.length === 0
  ) {
    return [];
  }

  const denormalizedPastIterations = normalizedPastIterations.allIds.map(
    iterationId => {
      return normalizedPastIterations.byId[iterationId];
    }
  );

  return denormalizedPastIterations;
};

export default pastIterationsReducer;
