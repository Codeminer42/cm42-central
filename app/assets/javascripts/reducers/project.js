import actionTypes from 'actions/actionTypes';
import * as Project from '../models/beta/project';

const initialState = {};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_PROJECT:
      return action.data;
    case actionTypes.ADD_LABEL:
      return Project.addLabel(state, action.label);
    default:
      return state;
  };
};

export default projectReducer;
