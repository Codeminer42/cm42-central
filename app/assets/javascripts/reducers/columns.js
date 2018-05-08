import actionTypes from 'actions/actionTypes';

const initialState = {
  chilly_bin: {
    stories: [],
  },
  backlog: {
    stories: [],
  },
  in_progress: {
    stories: [],
  },
  done: {
    stories: [],
  },
};

const columns = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.COLUMN_CHILLY_BIN:
      return {
        ...state,
        chilly_bin: {
          stories: [
            ...state.chilly_bin.stories,
            action.data,
          ]
        }
      }
    case actionTypes.COLUMN_BACKLOG:
      return {
        ...state,
        backlog: {
          stories: [
            ...state.backlog.stories,
            action.data,
          ]
        }
      }
    case actionTypes.COLUMN_IN_PROGRESS:
      return {
        ...state,
        in_progress: {
          stories: [
            ...state.in_progress.stories,
            action.data,
          ]
        }
      }
    default:
      return state;
  }
};

export default columns;
