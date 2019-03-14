import actionTypes from './actionTypes';
import { setLoadingStory, storyFailure } from './story';

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
  async (dispatch, getState, { Note }) => {
    dispatch(setLoadingStory(storyId));

    try {
      await Note.destroy(projectId, storyId, noteId);
      return dispatch(deleteNoteSuccess(storyId, noteId));
    }
    catch (error) {
      return dispatch(storyFailure(storyId, error));
    }
  }

export const createNote = (projectId, storyId, note) =>
  async (dispatch, getState, { Note }) => {
    dispatch(setLoadingStory(storyId));

    try {
      const newNote = await Note.post(projectId, storyId, note);
      return dispatch(createNoteSuccess(storyId, newNote));
    }
    catch (error) {
      return dispatch(storyFailure(storyId, error));
    }
  }
