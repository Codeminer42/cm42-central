import httpService from '../../services/httpService';
import changeCase from'change-object-case';

export function get(projectId) {
  return httpService
    .get(`/beta/project_boards/${projectId}`)
    .then(({ data }) => changeCase.camelKeys(data, {recursive: true, arrayRecursive: true}))
    // This was necessary because the backend wasn't sending the notes on the stories in the right format,
    // This change act as a palliative measure until the backend is fixed
    .then(( projectBoard ) => ({
        ...projectBoard,
        stories: projectBoard.stories.map((story) => ({
          ...story,
          notes: story.notes.map((note) => (note.note)),
          collapsed: true
        }))
      }));
};
