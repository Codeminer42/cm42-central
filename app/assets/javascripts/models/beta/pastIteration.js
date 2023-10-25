import httpService from "../../services/httpService";
import changeCase from "change-object-case";
import { deserialize } from "./story";

export const getStories = async (projectId, startDate, endDate) => {
  const params = serialize({ startDate, endDate });
  const { data } = await httpService.get(
    `/project_boards/${projectId}/iterations`,
    { params }
  );
  return data.stories.map((story) => deserialize(story.story));
};

const serialize = (data) =>
  changeCase.snakeKeys(data, {
    recursive: true,
    arrayRecursive: true,
  });

export const normalizePastIterations = (pastIterations) => {
  return pastIterations.reduce(
    (acc, pastIteration) => {
      const pastIterationId = pastIteration.iterationNumber;

      acc.pastIterations.byId[pastIterationId] = { ...pastIteration };
      acc.pastIterations.allIds.push(pastIterationId);

      return acc;
    },
    {
      pastIterations: {
        byId: {},
        allIds: [],
      },
    }
  );
};

export const denormalizePastIterations = (pastIterations) => {
  const normalizedPastIterations = pastIterations?.pastIterations;

  if (
    !normalizedPastIterations ||
    normalizedPastIterations.allIds.length === 0
  ) {
    return [];
  }

  const denormalizedPastIterations = normalizedPastIterations.allIds.map(
    (iterationId) => {
      return normalizedPastIterations.byId[iterationId];
    }
  );

  return denormalizedPastIterations;
};
