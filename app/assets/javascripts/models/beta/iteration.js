import moment from 'moment';
import { last, isEmpty } from 'underscore';
import * as Story from './story';

const weeksBetween = (dateA, dateB) =>
  moment(new Date(dateA)).diff(moment(new Date(dateB)), 'week');

const getIterationForDate = (date, project) => {
  const weeks = weeksBetween(date, project.startDate);
  const iterationQuantity = Math.ceil(weeks / project.iterationLength);

  return project.iterationLength > weeks
    ? iterationQuantity
    : iterationQuantity + 1;
};

const getNextIterationNumber = iterations => {
  const lastIteration = last(iterations);

  return lastIteration ? lastIteration.number + 1 : 1;
};

const getStartDate = (iterationNumber, project) => {
  const projectStartDate = moment(project.startDate, 'YYYY/MM/DD');

  if (iterationNumber === 1) {
    return projectStartDate;
  }

  const missingDaysFromFirsIteration = firstIterationMissingDays(project);
  const daysUntilIteration = daysUntil(iterationNumber, project);
  const expectedProjectStartDate = projectStartDate.subtract(
    missingDaysFromFirsIteration,
    'days'
  );

  return expectedProjectStartDate.add(daysUntilIteration, 'days');
};

const firstIterationMissingDays = project =>
  (moment(project.startDate, 'YYYY/MM/DD').isoWeekday() -
    project.iterationStartDay) %
  7;

const daysUntil = (iterationNumber, project) =>
  (iterationNumber - 1) * (project.iterationLength * 7);

export const getDateForIterationNumber = (iterationNumber, project) =>
  getStartDate(iterationNumber, project).format('YYYY/MM/DD');

export const getCurrentIteration = project =>
  getIterationForDate(new Date(), project);

export const getIterationForStory = (story, project) => {
  if (story.state === 'accepted') {
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
  remainingPoints,
  isDropDisabled: false,
});

export const calculateRemainingPoints = (velocity, points) =>
  velocity - points > 0 ? velocity - points : 0;

const createFillerSprints = (
  quantityFillers,
  initialNumber,
  project,
  velocity,
  storyPoints
) =>
  _.times(quantityFillers, i => {
    const remainingPoints = isLastFiller(i, quantityFillers)
      ? calcPointsOverflowedSprint(velocity, storyPoints)
      : 0;
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

const createOverflowedSprint = (
  velocity,
  storyPoints,
  fillersSprints,
  project,
  overflowStory
) => {
  const numberSprint = getNextIterationNumber(fillersSprints);

  return createSprint(
    numberSprint,
    getDateForIterationNumber(numberSprint, project),
    true,
    velocity,
    [overflowStory],
    storyPoints,
    calcPointsOverflowedSprint(velocity, storyPoints)
  );
};

export const canTakeStory = (sprint, story) =>
  sprint.remainingPoints >= Story.getPoints(story) || !Story.isFeature(story);

export const calculateFillerSprintsQuantity = (storyPoints, velocity) =>
  Math.ceil((storyPoints - velocity) / velocity) || 0;

const addSprintWithOverflow = (
  project,
  sprints,
  story,
  velocity,
  firstSprintNumber
) => {
  const currentSprint = last(sprints);
  const storyPoints = Story.getPoints(story);
  const quantityFillers = calculateFillerSprintsQuantity(storyPoints, velocity);

  if (
    isFirstSprint(currentSprint, firstSprintNumber) &&
    haveNoPoints(currentSprint)
  ) {
    addStoryToSprint(project, sprints, 0, story, velocity);
    return sprints;
  } else {
    const indexOverflow = sprintIndexFor(currentSprint);
    const fillerSprints = createFillerSprints(
      quantityFillers,
      indexOverflow,
      project,
      velocity,
      storyPoints
    );
    const overflowedSprint = createOverflowedSprint(
      velocity,
      storyPoints,
      fillerSprints,
      project,
      story
    );
    return [...sprints, ...fillerSprints, overflowedSprint];
  }
};

const sprintIndexFor = sprint => sprint.number + 1;

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
  fillRemainingPoints(sprints, Story.getPoints(story), index);

  sprints[index].completedPoints += Story.getCompletedPoints(story);

  return sprints;
};

const fillRemainingPoints = (sprints, storyPoints, index) =>
  (sprints[index].remainingPoints -= storyPoints);

const createFirstSprint = (project, initialSprintNumber, velocity) =>
  createSprint(
    initialSprintNumber,
    getDateForIterationNumber(initialSprintNumber, project),
    false,
    velocity
  );

export const sprintVelocity = (project, pastIterations) => {
  return pastIterations.length < 3
    ? project.defaultVelocity
    : pastAverageVelocity(pastIterations);
};

const pastAverageVelocity = pastIterations => {
  const points = pastIterations.slice(-3);
  const result =
    points.reduce((sum, iteration) => sum + iteration.points, 0) / 3;
  return Math.floor(result) || 1;
};

const addToSprintFromBacklog = (sprints, project, story, velocity) => {
  const iterationNumber = getNextIterationNumber(sprints);

  return [
    ...sprints,
    createSprint(
      iterationNumber,
      getDateForIterationNumber(iterationNumber, project),
      false,
      velocity,
      [story],
      Story.getPoints(story)
    ),
  ];
};

export const groupBySprints = (
  stories = [],
  project,
  initialSprintNumber = 1
) => {
  const velocity = project.currentSprintVelocity;

  return stories.reduce((sprints, story) => {
    const firstSprintIndex = 0;
    const isFromSprintInProgress = Story.isInProgress(story);

    if (isEmpty(sprints)) {
      sprints = [createFirstSprint(project, initialSprintNumber, velocity)];
    }

    if (causesOverflow(story, velocity) && !isFromSprintInProgress) {
      return addSprintWithOverflow(
        project,
        sprints,
        story,
        velocity,
        initialSprintNumber
      );
    }

    if (isFromSprintInProgress) {
      return addStoryToSprint(
        project,
        sprints,
        firstSprintIndex,
        story,
        velocity
      );
    }

    if (canEnterLastAddedSprint(sprints, story)) {
      return addStoryToSprint(
        project,
        sprints,
        sprints.length - 1,
        story,
        velocity
      );
    }

    return addToSprintFromBacklog(sprints, project, story, velocity);
  }, []);
};

const isFirstSprint = (sprint, initialSprintNumber) =>
  sprint.number === initialSprintNumber;

const haveNoPoints = sprint => sprint.points === 0;

const canEnterLastAddedSprint = (sprints, story) => {
  const lastSprint = last(sprints);

  return canTakeStory(lastSprint, story);
};

export const causesOverflow = (story, velocity) =>
  Story.getPoints(story) > velocity && Story.isFeature(story);

const calcPointsOverflowedSprint = (velocity, storyPoints) =>
  velocity - (storyPoints % velocity);

const isLastFiller = (position, amountOfFillers) =>
  position === amountOfFillers - 1;

export const isNewStoryPosition = (sprint, position) =>
  !Boolean(sprint.stories[position]);
