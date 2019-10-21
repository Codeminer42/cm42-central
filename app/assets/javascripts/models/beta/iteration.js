import moment from "moment";
import { last } from 'underscore';
import PropTypes from 'prop-types';
import * as Story from "./story";

const weeksBetween = (dateA, dateB) =>
  moment(new Date(dateA)).diff(moment(new Date(dateB)), "week");

const getIterationForDate = (date, project) => {
  const weeks = weeksBetween(date, project.startDate);
  const iterationQuantity = Math.ceil(weeks / project.iterationLength);

  return project.iterationLength > weeks
    ? iterationQuantity
    : iterationQuantity + 1;
};

const getNextIterationNumber = (iterations) => {
  const lastIteration = last(iterations);

  return lastIteration ? lastIteration.number + 1 : 1;
}

const getStartDate = (iterationNumber, project) => {
  const projectStartDate = moment(project.startDate);

  if (iterationNumber === 1) {
    return projectStartDate;
  }

  const missingDaysFromFirsIteration = firstIterationMissingDays(project);
  const daysUntilIteration = daysUntil(iterationNumber, project);
  const expectedProjectStartDate = projectStartDate.subtract(missingDaysFromFirsIteration, 'days');

  return expectedProjectStartDate.add(daysUntilIteration, 'days');
}

const firstIterationMissingDays = (project) =>
  (moment(project.startDate).isoWeekday() - project.iterationStartDay) % 7;

const daysUntil = (iterationNumber, project) =>
  (iterationNumber - 1) * (project.iterationLength * 7);

export const getDateForIterationNumber = (iterationNumber, project) =>
  getStartDate(iterationNumber, project).format("YYYY/MM/DD");

export const getCurrentIteration = project =>
  getIterationForDate(new Date(), project);

export const getIterationForStory = (story, project) => {
  if (story.state === "accepted") {
    return getIterationForDate(new Date(story.acceptedAt), project);
  }
};

const createSprint = (
  sprintNumber = 0, 
  startDate = 0, 
  isFiller = false, 
  velocity, 
  stories = [],
  points = 0,
  remainingPoints = calculateRemainingPoints(velocity, points)
) => ({
  number: sprintNumber,
  startDate,
  points,
  completedPoints: null,
  stories,
  isFiller,
  remainingPoints
});

export const calculateRemainingPoints = (velocity, points) =>
  velocity - points > 0 ? velocity - points : 0;

const createFillerSprints = (
  quantityFillers,
  initialNumber,
  overflowStory,
  project,
  velocity
) => {
  const storyPoints = Story.getPoints(overflowStory);

  const fillersSprints = _.times(quantityFillers, i => {
    const remainingPoints = 0;
    const sprintNumber = initialNumber + i;
    const emptyStories = [];
    const sprintPoints = 0;
    return createSprint(
      sprintNumber,
      getDateForIterationNumber(sprintNumber, project),
      true,
      velocity,
      emptyStories,
      sprintPoints,
      remainingPoints
    );
  });

  const remainingPointsLastSprint = velocity - (storyPoints % velocity);
  const numberSprint = getNextIterationNumber(fillersSprints);

  return [...fillersSprints, createSprint(
    numberSprint,
    getDateForIterationNumber(numberSprint, project),
    true,
    velocity,
    [overflowStory],
    storyPoints,
    remainingPointsLastSprint
  )];
};

export const canTakeStory = (sprint, storyPoints) => sprint.remainingPoints >= storyPoints;

export const calculateFillerSprintsQuantity = (storyPoints, velocity) =>
  Math.ceil((storyPoints - velocity) / velocity) || 0;

const handleSprintsOverflow = (project, sprints, story, velocity, firstSprintNumber) => {
  const storyPoints = Story.getPoints(story);
  const quantityFillers = calculateFillerSprintsQuantity(storyPoints, velocity);
  const indexOverflow = calculateIndexSprint(firstSprintNumber, sprints);

  const fillerSprints = createFillerSprints(quantityFillers, indexOverflow, story, project, velocity);
  return [...sprints, ...fillerSprints];
};

const calculateIndexSprint = (firstSprintNumber, sprints) => {
  if (sprints.length) {
    const { number } = last(sprints);
    return number + 1;
  }

  return firstSprintNumber;
}

const addStoryToSprint = (project, sprints, index, story, velocity) => {
  sprints[index].stories.push(story);
  sprints[index].points += Story.getPoints(story);
  const lastValidSprintIndex = sprints.length - 2;

  let previousFillerSprintsQuantity = 0;
  for (let i = lastValidSprintIndex; i >= 0; i--) {
    if (sprints[i].isFiller) {
      previousFillerSprintsQuantity++;
    } else {
      break;
    }
  }
  fillRemainingPoints(
    sprints,
    Story.getPoints(story),
    index,
    velocity,
    previousFillerSprintsQuantity
  );

  sprints[index].completedPoints += Story.getCompletedPoints(story);

  return sprints;
};

const fillRemainingPoints = (sprints, storyPoints, index, velocity, previousFillerSprintsQuantity) => {
  if (previousFillerSprintsQuantity === 0) {
    sprints[index].remainingPoints -= storyPoints;
  } else {
    sprints[index].remainingPoints = storyPoints - (previousFillerSprintsQuantity * velocity);
  }
};

const createFirstSprint = (sprints, project, initialSprintNumber, velocity) => {
  sprints.push(createSprint(
    initialSprintNumber,
    getDateForIterationNumber(initialSprintNumber, project),
    undefined,
    velocity
  ));
};

const sprintVelocity = (project, pastIterations) => {
  return pastIterations.length < 3
    ? project.defaultVelocity
    : pastAverageVelocity(pastIterations)
}

const pastAverageVelocity = (pastIterations) => {
  const points = pastIterations.slice(-3)
  const result = points.reduce((sum, iteration) => sum + iteration.points, 0) / 3
  return Math.floor(result) || 1
}

const addToSprintFromBacklog = (sprints, project, story, velocity) => {
  const iterationNumber = getNextIterationNumber(sprints);

  const newSprint = createSprint(
    iterationNumber,
    getDateForIterationNumber(iterationNumber, project),
    false,
    velocity,
    [story],
    Story.getPoints(story)
  );
  sprints.push(newSprint);
  return sprints;
};

export const groupBySprints = (stories = [], project, initialSprintNumber = 1, pastIterations) => {
  const velocity = sprintVelocity(project, pastIterations)

  return stories.reduce((sprints, story) => {
    const firstSprintIndex = 0;
    const isFromSprintInProgress = !Story.isUnstarted(story);

    if (hasOverflow(story, velocity) && !isFromSprintInProgress) {
      return handleSprintsOverflow(project, sprints, story, velocity, initialSprintNumber);
    }

    if (sprints.length === 0) {
      createFirstSprint(sprints, project, initialSprintNumber, velocity);
    }

    if (isFromSprintInProgress) {
      return addStoryToSprint(project, sprints, firstSprintIndex, story, velocity);
    }

    if (canEnterOnLastSprint(sprints, story, velocity)) {
      return addStoryToSprint(project, sprints, sprints.length - 1, story, velocity);
    }

    return addToSprintFromBacklog(sprints, project, story, velocity);
  }, []);
};

const canEnterOnLastSprint = (sprints, story, velocity) => {
  const lastSprint = last(sprints);
  const storyPoints = Story.getPoints(story);

  return lastSprint ? canTakeStory(lastSprint, storyPoints) : false;
}

const hasOverflow = (story, velocity) => Story.getPoints(story) > velocity;

export const sprintPropTypesShape = PropTypes.shape({
  number: PropTypes.number,
  startDate: PropTypes.string,
  points: PropTypes.number,
  completedPoints: PropTypes.number,
  stories: PropTypes.array,
  isFiller: PropTypes.bool,
  remainingPoints: PropTypes.bool
});
