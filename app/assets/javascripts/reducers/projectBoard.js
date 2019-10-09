import actionTypes from 'actions/actionTypes';
import { 
  toggleStory, withoutNewStory, editStory, 
  setLoadingStory, updateStory 
} from 'models/beta/story';
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
  case actionTypes.EDIT_STORY_SEARCH:
    return {
      ...state,
      searchedColumn: {
        ...state.searchedColumn,
        stories: state.searchedColumn.stories.map(
          updateIfSameId(action.id, (story) => editStory(story, action.newAttributes)))
      }
    }
  case actionTypes.SET_LOADING_SEARCH_STORY:
    return {
      ...state,
      searchedColumn: {
        ...state.searchedColumn,
        stories: state.searchedColumn.stories.map(updateIfSameId(action.id, setLoadingStory))
      }
    }
  case actionTypes.UPDATE_STORY_SEARCH_SUCCESS:
    return {
      ...state,
      searchedColumn: {
        ...state.searchedColumn,
        stories: state.searchedColumn.stories.map(
          updateIfSameId(action.story.id, (story) => updateStory(story, action.story))
        )
      }
    }
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
