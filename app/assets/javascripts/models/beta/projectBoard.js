import axios from 'axios';
import camelCase from 'camelcase-object-deep';

export function get(projectId) {
  return axios
    .get(`/beta/project_boards/${projectId}`)
    .then(({ data }) => camelCase(data, {deep: true}))
    // This was necessary because the backend wasn't sending the notes on the stories in the right format,
    // This change act as a palliative measure until the backend is fixed
    .then(( projectBoard ) => ({
        ...projectBoard,
        stories: projectBoard.stories.map((story) => ({
          ...story,
          notes: story.notes.map((note) => (note.note))
        }))
      }));
}
