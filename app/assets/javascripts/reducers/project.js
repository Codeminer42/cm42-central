import actionTypes from 'actions/actionTypes';
import * as Project from '../models/beta/project';

const initialState = {};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_PROJECT:
      return action.data;
    case actionTypes.ADD_LABEL_TO_PROJECT:
      return Project.addLabel(state, action.label);
    case actionTypes.REVERT_TO_CALCULATED_VELOCITY:
      return  {...state, currentSprintVelocity: state.calculatedSprintVelocity};
    case actionTypes.SIMULATE_SPRINT_VELOCITY:
      return  {...state, currentSprintVelocity: action.simulatedSprintVelocity};
    default:
      return state;
  };
};

export default projectReducer;
