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

const createSprint = (sprintNumber = 0, startDate = 0, isFiller = false, velocity) => ({
  number: sprintNumber,
  startDate,
  points: 0,
  completedPoints: null,
  stories: [],
  isFiller,
  remainingPoints: velocity
});

const createFillerSprints = (size, initialNumber, project, velocity) => {
  return _.times(size, (i) => {
    const sprintNumber = initialNumber + i;
    const sprint = createSprint(
      sprintNumber,
      getDateForIterationNumber(sprintNumber, project),
      true,
      velocity
    );
    return sprint;
  })
};

const canTakeStory = (sprint, storyPoints) => {
  if (!sprint.isFiller) {
    return sprint.remainingPoints >= storyPoints;
  }
  return false;
};

const calculateFillerSprintsQuantity = (storyPoints, velocity) => {
  return Math.ceil((storyPoints - velocity) / velocity);
};

const handleSprintsOverflow = (project, sprints, storyPoints, initialSprintNumber, velocity) => {
  const overflow = calculateFillerSprintsQuantity(storyPoints, velocity);
  const hasOverflown = overflow > 0;
  const currentSprintNumber = sprints.length + initialSprintNumber;
  if (hasOverflown) {
    return [
      ...sprints,
      ...createFillerSprints(overflow, currentSprintNumber, project, velocity)
    ];
  }
  return sprints;
};

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
  const sprintIndex = sprints.length && sprints.length - 1;
  const hasSpace = canTakeStory(sprints[sprintIndex], Story.getPoints(story));

  if (hasSpace) {
    return addStoryToSprint(project, sprints, sprintIndex, story, velocity);
  }

  const iterationNumber = getNextIterationNumber(sprints);

  sprints[sprintIndex + 1] = createSprint(
    iterationNumber,
    getDateForIterationNumber(iterationNumber, project),
    undefined,
    velocity
  );

  return addStoryToSprint(project, sprints, sprintIndex + 1, story, velocity);
};

export const groupBySprints = (stories = [], project, initialSprintNumber = 1, pastIterations) => {
  const velocity = sprintVelocity(project, pastIterations)

  return stories.reduce((sprints, story) => {
    const firstSprintIndex = 0;
    const isFromSprintInProgress = !Story.isUnstarted(story);

    sprints = handleSprintsOverflow(
      project,
      sprints,
      Story.getPoints(story),
      initialSprintNumber,
      velocity
    );

    if (sprints.length === 0) {
      createFirstSprint(sprints, project, initialSprintNumber, velocity);
    }

    if (isFromSprintInProgress) {
      return addStoryToSprint(project, sprints, firstSprintIndex, story, velocity);
    }

    return addToSprintFromBacklog(sprints, project, story, velocity);
  }, []);
};

export const sprintPropTypesShape = PropTypes.shape({
  number: PropTypes.number,
  startDate: PropTypes.string,
  points: PropTypes.number,
  completedPoints: PropTypes.number,
  stories: PropTypes.array,
  isFiller: PropTypes.bool,
  remainingPoints: PropTypes.bool
});
