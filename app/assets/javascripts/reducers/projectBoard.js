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
      search: {
        ...state.search,
        result: state.search.result.map(
          updateIfSameId(action.id, (story) => editStory(story, action.newAttributes)))
      }
    }
  case actionTypes.SET_LOADING_SEARCH_STORY:
    return {
      ...state,
      search: {
        ...state.search,
        result: state.search.result.map(updateIfSameId(action.id, setLoadingStory))
      }
    }
  case actionTypes.UPDATE_STORY_SEARCH_SUCCESS:
    return {
      ...state,
      search: {
        ...state.search,
        result: state.search.result.map(
          updateIfSameId(action.story.id, (story) => updateStory(story, action.story))
        )
      }
    }
  case actionTypes.SEARCH_STORIES_SUCCESS:
    return {
      ...state,
      search: action.search,
    }
  case actionTypes.CLOSE_SEARCH:
    return {
      ...state,
      search: false,
    }
  case actionTypes.TOGGLE_STORY_SEARCH:
    if (action.id === null) {
      return withoutNewStory(state.search.result);
    }
    
    return {
      ...state,
      search: {
        ...state.search,
        result: state.search.result.map(updateIfSameId(action.id, toggleStory))
      }
    }
  default:
    return state;
  }
};

export default projectBoardReducer;
