import actionTypes from 'actions/actionTypes';

const initialState = {
  stories: [],
};

const chillyBin = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.COLUMN_CHILLY_BIN:
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

export default chillyBin;
