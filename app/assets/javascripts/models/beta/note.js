import httpService from '../../services/httpService';

export const deleteNote = (projectId, storyId, noteId) => {
  return httpService
    .delete(`/projects/${projectId}/stories/${storyId}/notes/${noteId}`)
};

export const deleteNoteSuccess = (story, noteId) => {
  return {
    ...story,
    notes: story.notes.filter(note => note.id !== noteId)
  }
}
