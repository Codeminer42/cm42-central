import httpService from '../../services/httpService';
import changeCase from'change-object-case';

export function get(projectId) {
  return httpService
    .get(`/beta/project_boards/${projectId}`)
    .then(({ data }) => changeCase.camelKeys(data, {recursive: true, arrayRecursive: true}))
    .then(( projectBoard ) => ({
        ...projectBoard,
        stories: projectBoard.stories.map((story) => ({
          ...story,
          estimate: story.estimate || '',
          collapsed: true
        }))
      }));
};
