import actionTypes from 'actions/actionTypes';
import { toggleStory, withoutNewStory } from 'models/beta/story';
import { updateIfSameId } from '../services/updateIfSameId';

const initialState = {
  isFetched: false,
  error: null
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
      searchedColumn: action.searchedColumn,
    }
  case actionTypes.CLOSE_SEARCH:
    return {
      ...state,
      searchedColumn: false,
    }
  case actionTypes.TOGGLE_STORY_SEARCH:
    if (action.id === null) {
      return withoutNewStory(state.searchedColumn.stories);
    }
    
    return {
      ...state,
      searchedColumn: {
        ...state.searchedColumn,
        stories: state.searchedColumn.stories.map(updateIfSameId(action.id, toggleStory))
      }
    }
  default:
    return state;
  }
};

export default projectBoardReducer;
