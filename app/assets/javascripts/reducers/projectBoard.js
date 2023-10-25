import actionTypes from 'actions/actionTypes';

const initialState = {
  isFetched: false,
  isInitialLoading: true,
  error: null,
  search: {
    loading: false
  },
  reverse: false,
  visibleColumns: {
    chillyBin: true,
    backlog: true,
    done: true,
  }
};

const projectBoardReducer = (state = initialState, action) => {
  switch(action.type) {
  case actionTypes.REQUEST_PROJECT_BOARD:
    return {
      ...state,
      isFetched: false,
      isInitialLoading: state.isInitialLoading,
      error: null
    };
  case actionTypes.RECEIVE_PROJECT_BOARD:
    return {
      ...state,
      projectId: action.data,
      isFetched: true,
      isInitialLoading: false
    };
  case actionTypes.ERROR_REQUEST_PROJECT_BOARD:
    return {
      ...state,
      error: action.error
    };
  case actionTypes.SEARCH_STORIES_SUCCESS:
    return {
      ...state,
      search: {
        ...state.search,
        keyWord: action.keyWord
      }
    }
  case actionTypes.CLOSE_SEARCH:
    return {
      ...state,
      search: {
        ...state.search,
        keyWord: ''
      },
    }
  case actionTypes.LOADING_SEARCH:
    return {
      ...state,
      search: {
        ...state.search,
        loading: action.loading
      }
    }
  case actionTypes.REVERSE_COLUMNS:
    return {
      ...state,
      reverse: !state.reverse
    }
  case actionTypes.TOGGLE_COLUMN_VISIBILITY:
    return {
      ...state,
      visibleColumns: {
        ...state.visibleColumns,
        [action.column]: !state.visibleColumns[action.column]
      }
    }
  default:
    return state;
  }
};

export default projectBoardReducer;
