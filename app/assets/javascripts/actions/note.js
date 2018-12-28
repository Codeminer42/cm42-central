import actionTypes from './actionTypes';

export const deleteNoteSuccess = (storyId, noteId) => ({
  type: actionTypes.DELETE_NOTE,
  storyId,
  noteId
});

export const deleteNote = (projectId, storyId, noteId) => {
  return (dispatch, getState, { Note }) => {
    return Note.deleteNote(projectId, storyId, noteId)
      .then(dispatch(deleteNoteSuccess(storyId, noteId)));
  };
};
