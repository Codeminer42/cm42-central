import actionTypes from 'actions/actionTypes';
import { toggleStory, editStory, updateStory } from 'models/beta/story';
import * as Note from 'models/beta/note';

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
    case actionTypes.ADD_NOTE:
      return state.map(
        updateIfSameId(action.storyId, (story) => {
          return Note.addNote(story, action.note)
        }));
    case actionTypes.DELETE_NOTE:
      return state.map(
        updateIfSameId(action.storyId, (story) => {
          return Note.deleteNote(story, action.noteId)
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
