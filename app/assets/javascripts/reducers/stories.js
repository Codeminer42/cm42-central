import actionTypes from 'actions/actionTypes';
import { toggleStory, editStory, updateStory } from 'models/beta/story'

const initialState = [];

const storiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_STORIES:
      return action.data;
    case actionTypes.TOGGLE_STORY:
      return state.map(
        updateIfSameId(action.id, toggleStory));
    case actionTypes.EDIT_STORY:
      return state.map(
        updateIfSameId(action.id, (story) => {
          return editStory(story, action.newAttributes);
        }));
    case actionTypes.UPDATE_STORY_SUCCESS:
      return state.map(
        updateIfSameId(action.story.id, (story) => {
          return updateStory(story, action.story);
        }));
    case actionTypes.DELETE_STORY_SUCCESS:
    return state.map(
      updateIfSameId(action.id, () => {
        return () => null;
      }));
    default:
      return state;
  };
};

const updateIfSameId = (id, update) => {
  return (model) => {
    if (model.id !== id) {
      return model;
    };
    return update(model);
  };
};

export default storiesReducer;
