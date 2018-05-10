import actionTypes from 'actions/actionTypes';

const initialState = {};

const storiesReducer = (state = initialState, action) => {
  switch(action.type) {
  case actionTypes.RECEIVE_STORIES:
    return action.data;
  default:
    return state;
  }
};

export default storiesReducer;
