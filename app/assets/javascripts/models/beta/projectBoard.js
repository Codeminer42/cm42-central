import httpService from '../../services/httpService';
import changeCase from 'change-object-case';
import * as Story from './story';
import * as Project from './project';
import PropTypes from 'prop-types';

export function get(projectId) {
  return httpService
    .get(`/beta/project_boards/${projectId}`)
    .then(({ data }) => changeCase.camelKeys(data, { recursive: true, arrayRecursive: true }))
    .then((projectBoard) => ({
      ...projectBoard,
      project: Project.deserialize(projectBoard),
      stories: projectBoard.stories.map(Story.deserialize)
    }));
};

export const projectBoardPropTypesShape = PropTypes.shape({
  error: PropTypes.oneOf([
    PropTypes.object,
    PropTypes.array
  ]),
  isFetched: PropTypes.bool.isRequired
});
