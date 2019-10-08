import httpService from '../../services/httpService';
import changeCase from 'change-object-case';
import * as Story from './story';
import * as Project from './project';
import PropTypes from 'prop-types';

export const get = async (projectId) => {
  const { data } = await httpService
    .get(`/beta/project_boards/${projectId}`);

  return deserialize(data);
};

export const projectBoardPropTypesShape = PropTypes.shape({
  error: PropTypes.oneOf([
    PropTypes.object,
    PropTypes.array
  ]),
  isFetched: PropTypes.bool.isRequired
});

const deserialize = (data) => {
  const projectBoard = changeCase.camelKeys(data, {
    recursive: true,
    arrayRecursive: true
  });

  return {
    ...projectBoard,
    project: Project.deserialize(projectBoard),
    stories: projectBoard.stories.map(Story.deserialize)
  }
}

export const hasSearchedStories = projectBoard => Boolean(projectBoard.searchedColumn)

export const searchStories = async (keyWord, projectId) => ({
  stories: await Story.search(keyWord, projectId),
  title: `"${keyWord}"`
})
