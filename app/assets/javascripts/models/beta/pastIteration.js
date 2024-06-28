import httpService from '../../services/httpService';
import changeCase from 'change-object-case';
import { deserialize } from './story';

export const getStories = async (projectId, startDate, endDate) => {
  const params = serialize({ startDate, endDate });
  const { data } = await httpService.get(
    `/project_boards/${projectId}/iterations`,
    { params }
  );
  return data.stories.map(story => deserialize(story.story));
};

const serialize = data =>
  changeCase.snakeKeys(data, {
    recursive: true,
    arrayRecursive: true,
  });
