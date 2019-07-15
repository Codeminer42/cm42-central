import actionTypes from 'actions/actionTypes';

const historyStatus = {
  DISABLED: 'DISABLED', // Vai para loading
  LOADING: 'LOADING', // vai para loaded ou para failed
  LOADED: 'LOADED', // vai para disabled ou para loading
  FAILED: 'FAILED' // vai para disabled ou para loading
}

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

