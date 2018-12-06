import actionTypes from 'actions/actionTypes';

const initialState = {};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_PROJECT:
      return action.data;
    default:
      return state;
  };
};

export default projectReducer;
