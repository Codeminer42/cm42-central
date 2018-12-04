import actionTypes from 'actions/actionTypes';
import { toggleStories } from './story';

const initialState = [];

const storiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_STORIES:
      return action.data;
    case actionTypes.TOGGLE_STORY:
      return toggleStories(state, action.id);
    default:
      return state;
  }
};

export default storiesReducer;
