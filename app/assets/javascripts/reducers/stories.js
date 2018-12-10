import actionTypes from 'actions/actionTypes';
import { toggleStories, editStory } from './story';

const initialState = [];

const storiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_STORIES:
      return action.data;
    case actionTypes.TOGGLE_STORY:
      return toggleStories(state, action.id);
    case actionTypes.EDIT_STORY:
      return editStory(state, action.id, action.newAttributes);
    default:
      return state;
  };
};

export default storiesReducer;
