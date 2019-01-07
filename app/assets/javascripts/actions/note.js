import actionTypes from './actionTypes';

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
  (dispatch, getState, { Note }) =>
    Note.destroy(projectId, storyId, noteId)
      .then(() => dispatch(deleteNoteSuccess(storyId, noteId)));

export const createNote = (projectId, storyId, note) =>
  (dispatch, getState, { Note }) =>
    Note.post(projectId, storyId, note)
      .then((note) => dispatch(createNoteSuccess(storyId, note)));
