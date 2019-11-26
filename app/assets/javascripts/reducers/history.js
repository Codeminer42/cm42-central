import actionTypes from 'actions/actionTypes';
import { historyStatus } from '../libs/beta/constants';

const initialState = {
  status: historyStatus.DISABLED,
  activities: null,
  storyTitle: null
};

const historyReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CLOSE_HISTORY:
      return initialState
    case actionTypes.LOAD_HISTORY:
      return { ...state, storyTitle: action.title, status: historyStatus.LOADING }
    case actionTypes.RECEIVE_HISTORY_ERROR:
      return { ...state, status: historyStatus.FAILED }
    case actionTypes.RECEIVE_HISTORY:
      return { ...state, activities: action.activities, status: historyStatus.LOADED }
    default:
      return state;
  }
};

export default historyReducer;

