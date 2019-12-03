import actionTypes from 'actions/actionTypes';
import {
  setLoadingStory, updateStory 
} from 'models/beta/story';
import { updateIfSameId } from '../services/updateIfSameId';

const initialState = {
  isFetched: false,
  error: null,
  search: {
    loading: false
  },
  reverse: false
};

const projectBoardReducer = (state = initialState, action) => {
  switch(action.type) {
  case actionTypes.REQUEST_PROJECT_BOARD:
    return {
      ...state,
      isFetched: false,
      error: null
    };
  case actionTypes.RECEIVE_PROJECT_BOARD:
    return {
      ...state,
      projectId: action.data,
      isFetched: true
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
  default:
    return state;
  }
};

export default projectBoardReducer;
