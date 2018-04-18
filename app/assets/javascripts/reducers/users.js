import actionTypes from 'actions/actionTypes';

const initialState = [];

const usersReducer = (state = initialState, action) => {
  switch(action.type) {
  case actionTypes.RECEIVE_USERS:
    return action.data;
  default:
    return state;
  }
};

export default usersReducer;
