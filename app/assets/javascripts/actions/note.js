import actionTypes from './actionTypes';
import { setLoadingStory } from './story';

export const deleteNoteSuccess = (storyId, noteId) => ({
  type: actionTypes.DELETE_NOTE,
  storyId,
  noteId
});

export const createNoteSuccess = (storyId, note) => ({
  type: actionTypes.ADD_NOTE,
  storyId,
  note
});

export const deleteNote = (projectId, storyId, noteId) =>
  (dispatch, getState, { Note }) => {
    dispatch(setLoadingStory(storyId));
    return Note.destroy(projectId, storyId, noteId)
      .then(() => dispatch(deleteNoteSuccess(storyId, noteId)))
      .catch(() => dispatch(setLoadingStory(storyId)))
  }

export const createNote = (projectId, storyId, note) =>
  (dispatch, getState, { Note }) => {
    dispatch(setLoadingStory(storyId));
    return Note.post(projectId, storyId, note)
      .then((note) => dispatch(createNoteSuccess(storyId, note)))
      .catch(() => dispatch(setLoadingStory(storyId)))
  }
