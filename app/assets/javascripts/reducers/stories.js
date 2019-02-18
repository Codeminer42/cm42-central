import actionTypes from 'actions/actionTypes';
import {
  toggleStory, editStory, updateStory, newStory,
   setLoadingStory, storyFailure, removeEmptyStory
} from 'models/beta/story';
import * as Note from 'models/beta/note';
import * as Task from 'models/beta/task';
import * as Label from 'models/beta/label';
import * as Attachment from 'models/beta/attachment';
import { updateIfSameId } from '../services/updateIfSameId';

const initialState = [];

const storiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_STORIES:
      return action.data;
    case actionTypes.CREATE_STORY:
      return [
        newStory(),
        ...state,
      ];
    case actionTypes.ADD_STORY:
      const stories = removeEmptyStory(state);

      return [
        action.story,
        ...stories
      ];
    case actionTypes.TOGGLE_STORY:
      if (action.id === null) {
        return removeEmptyStory(state);
      }

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
    case actionTypes.STORY_FAILURE:
      return state.map(
        updateIfSameId(action.id, (story) => {
          return storyFailure(story, action.error);
        }));
    case actionTypes.SET_LOADING_STORY:
      return state.map(
        updateIfSameId(action.id, setLoadingStory));
    case actionTypes.ADD_TASK:
      return state.map(
        updateIfSameId(action.storyId, (story) => {
          return Task.addTask(story, action.task);
        }));
    case actionTypes.REMOVE_TASK:
      return state.map(
        updateIfSameId(action.storyId, (story) => {
          return Task.deleteTask(action.task, story);
        }));
    case actionTypes.TOGGLE_TASK:
      return state.map(
        updateIfSameId(action.story.id, (story) => {
          return Task.toggleTask(story, action.task);
        }));
    case actionTypes.DELETE_STORY_SUCCESS:
      return state.filter(
        story => story.id !== action.id
      );
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
    case actionTypes.ADD_TASK:
      return state.map(
        updateIfSameId(action.story.id, (story) => {
          return Task.addTask(story, action.task);
        }));
    case actionTypes.REMOVE_TASK:
      return state.map(
        updateIfSameId(action.story.id, (story) => {
          return Task.deleteTask(action.task, story);
        }));
    case actionTypes.UPDATE_TASK:
      return state.map(
        updateIfSameId(action.story.id, (story) => {
          return Task.updateTask(story, action.task);
        }));
    case actionTypes.ADD_LABEL:
      return state.map(
        updateIfSameId(action.storyId, (story) => ({
          ...story,
          _editing: {
            ...story._editing,
            _isDirty: true,
            labels: Label.addLabel(story._editing.labels, action.label)
          }
        }))
      );
    case actionTypes.DELETE_LABEL:
      return state.map(
        updateIfSameId(action.storyId, (story) => ({
          ...story,
          _editing: {
            ...story._editing,
            _isDirty: true,
            labels: Label.removeLabel(story._editing.labels, action.labelName)
          }
        }))
      );
    case actionTypes.ADD_ATTACHMENT:
      return state.map(
        updateIfSameId(action.storyId, (story) => {
          return Attachment.addAttachment(story, action.attachment)
        }));
    case actionTypes.DELETE_ATTACHMENT:
      return state.map(
        updateIfSameId(action.storyId, (story) => {
          return Attachment.removeAttachment(story, action.attachmentId)
        }));
    default:
      return state;
  };
};

export default storiesReducer;
