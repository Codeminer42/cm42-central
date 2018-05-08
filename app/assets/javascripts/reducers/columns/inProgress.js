import actionTypes from 'actions/actionTypes';

const initialState = {
  stories: [],
};

const inProgress = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.COLUMN_IN_PROGRESS:
    console.log(action.type, state, action.data)
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

export default inProgress;
