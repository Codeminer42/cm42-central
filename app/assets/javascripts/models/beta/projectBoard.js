import axios from 'axios';
import camelCase from 'camelcase-object-deep';

export function get(projectId) {
  return axios
    .get(`/beta/project_boards/${projectId}`)
    .then(({ data }) => camelCase(data, {deep: true}))
    .then(( projectBoard ) => ({
        ...projectBoard,
        stories: projectBoard.stories.map((story) => ({
          ...story,
          collapsed: true
        }))
      }));
};
