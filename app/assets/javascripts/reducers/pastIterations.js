import actionTypes from 'actions/actionTypes';

const initialState = [];

const pastIterationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_PAST_ITERATIONS:
      return action.data;
    default:
      return state;
  }
};

export default pastIterationsReducer;
