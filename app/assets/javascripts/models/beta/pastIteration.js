import httpService from '../../services/httpService';
import changeCase from 'change-object-case';
import PropTypes from 'prop-types';
import { deserialize } from './story';

export const getStories = async (projectId, startDate, endDate) => {
    const params = serialize({ startDate, endDate });
    const { data } = await httpService
        .get(`/project_boards/${projectId}/iterations`, { params });
    return data.stories.map(story => deserialize(story.story));
};

export const pastIterationPropTypesShape = PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    iterationNumber: PropTypes.number,
    stories: PropTypes.array,
    storyIds: PropTypes.array,
    points: PropTypes.number,
    fetched: PropTypes.bool,
    isFetching: PropTypes.bool
});

const serialize = (data) =>
    changeCase.snakeKeys(data, {
        recursive: true,
        arrayRecursive: true
    });
