import httpService from '../../services/httpService';
import changeCase from 'change-object-case';

export const destroy = (projectId, storyId, noteId) =>
  httpService
    .delete(`/projects/${projectId}/stories/${storyId}/notes/${noteId}`);

export const post = (projectId, storyId, note) =>
  httpService
    .post(`/projects/${projectId}/stories/${storyId}/notes`, { note })
    .then(({ data }) => changeCase.camelKeys(data, { recursive: true, arrayRecursive: true }));

export const addNote = (story, note) => (
  {
    ...story,
    _editing: {
      ...story._editing,
      loading: false
    },
    notes: [
      ...story.notes,
      note
    ]
  }
);

export const deleteNote = (story, noteId) => (
  {
    ...story,
    _editing: {
      ...story._editing,
      loading: false
    },
    notes: story.notes.filter(note => note.id !== noteId)
  }
);
