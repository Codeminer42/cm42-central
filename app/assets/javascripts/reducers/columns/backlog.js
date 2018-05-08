import actionTypes from 'actions/actionTypes';

const initialState = {
  stories: [],
};

const backlog = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.COLUMN_BACKLOG:
      return {
        stories: [
          ...state.stories,
          action.data,
        ]
      }
    default:
      return state;
  }
};

export default backlog;
