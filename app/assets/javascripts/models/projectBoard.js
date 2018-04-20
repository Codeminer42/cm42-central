/* eslint import/prefer-default-export:"off" */
import axios from 'axios';

export function get(projectId) {
  return axios
    .get(`/beta/project_boards/${projectId}`)
    .then(({ data }) => data);
}
