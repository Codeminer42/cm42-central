import actionTypes from 'actions/actionTypes';
import { toggleStories, editStory, updateStory } from './story';

const initialState = [];

const storiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_STORIES:
      return action.data;
    case actionTypes.TOGGLE_STORY:
      return toggleStories(state, action.id);
    case actionTypes.EDIT_STORY:
      return editStory(state, action.id, action.newAttributes);
    case actionTypes.UPDATE_STORY_SUCCESS:
      return updateStory(state, action.story.id, action.story);
    default:
      return state;
  };
};

export default storiesReducer;
