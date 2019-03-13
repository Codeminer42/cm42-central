import httpService from '../../services/httpService';
import changeCase from 'change-object-case';
import { setLoadingValue } from './story';
import PropTypes from 'prop-types';

export const destroy = (projectId, storyId, noteId) =>
  httpService
    .delete(`/projects/${projectId}/stories/${storyId}/notes/${noteId}`);

export const post = (projectId, storyId, note) =>
  httpService
    .post(`/projects/${projectId}/stories/${storyId}/notes`, { note })
    .then(({ data }) => changeCase.camelKeys(data, { recursive: true, arrayRecursive: true }));

export const addNote = (story, note) => ({
  ...story,
  _editing: setLoadingValue(story._editing, false),
  notes: [
    ...story.notes,
    note
  ]
});

export const deleteNote = (story, noteId) => ({
  ...story,
  _editing: setLoadingValue(story._editing, false),
  notes: story.notes.filter(note => note.id !== noteId)
});

export const notePropTypesShape = PropTypes.shape({
  id: PropTypes.number,
  note: PropTypes.string,
  userId: PropTypes.number,
  storyId: PropTypes.number,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  userName: PropTypes.string,
  errors: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
});
