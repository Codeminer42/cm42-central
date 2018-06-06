import actionTypes from 'actions/actionTypes';

const initialState = {
  stories: [],
};

const done = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.COLUMN_DONE:
      return {
        stories: [
          ...state.stories,
          action.data,
        ]
      };
    default:
      return state;
  }
};

export default done;
