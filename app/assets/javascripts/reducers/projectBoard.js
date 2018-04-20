import actionTypes from 'actions/actionTypes';

const initialState = {
  isFetched: false,
  error: null,
};

const projectBoardReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.REQUEST_PROJECT_BOARD:
      return {
        ...state,
        isFetched: false,
        error: null,
      };
    case actionTypes.RECEIVE_PROJECT_BOARD:
      return {
        ...state,
        projectId: action.data,
        isFetched: true,
      };
    case actionTypes.ERROR_REQUEST_PROJECT_BOARD:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};

export default projectBoardReducer;
