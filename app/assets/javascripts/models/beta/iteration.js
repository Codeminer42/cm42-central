import moment from "moment";
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

export const getDateForIterationNumber = (iterationNumber, project) => {
  return moment(new Date(project.startDate))
    .startOf("isoWeek")
    .add(iterationNumber, "weeks")
    .format("ddd MMM Do Y");
};

export const getCurrentIteration = project =>
  getIterationForDate(new Date(), project);

export const getIterationForStory = (story, project) => {
  if (story.state === "accepted") {
    return getIterationForDate(new Date(story.acceptedAt), project);
  }
};

const createSprint = (sprintNumber = 0, startDate = 0, isFiller = false, velocity) => ({
  number: sprintNumber + 1,
  startDate: startDate,
  points: 0,
  completedPoints: null,
  stories: [],
  isFiller: isFiller,
  remainingPoints: velocity 
});

const createFillerSprints = (size, initialNumber, project) => {
  return _.times(size, (i) => {
    const sprintNumber = initialNumber + i;
    const sprint = createSprint(
      sprintNumber,
      getDateForIterationNumber(sprintNumber, project),
      true,
      project.defaultVelocity
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

const handleSprintsOverflow = (project, sprints, storyPoints, initialSprintNumber) => {
  const overflow = calculateFillerSprintsQuantity(storyPoints, project.defaultVelocity);
  const hasOverflown = overflow > 0;
  const currentSprintNumber = sprints.length + initialSprintNumber;
  if (hasOverflown) {
    return [
      ...sprints,
      ...createFillerSprints(overflow, currentSprintNumber, project)
    ];
  }
  return sprints;
};

const addStoryToSprint = (project, sprints, index, story) => {
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
    project.defaultVelocity,
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

const createFirstSprint = (sprints, project, initialSprintNumber) => {
  sprints.push(createSprint(
    initialSprintNumber,
    getDateForIterationNumber(initialSprintNumber, project),
    undefined,
    project.defaultVelocity,
  ));
};

const addToSprintFromBacklog = (sprints, project, story) => {
  const sprintIndex = sprints.length && sprints.length - 1;
  const hasSpace = canTakeStory(sprints[sprintIndex], Story.getPoints(story));
  
  if (hasSpace) {
    return addStoryToSprint(project, sprints, sprintIndex, story);
  }
  
  sprints[sprintIndex + 1] = createSprint(
    sprints.length + getCurrentIteration(project),
    getDateForIterationNumber(sprints.length + getCurrentIteration(project), project),
    undefined,
    project.defaultVelocity
  );

  return addStoryToSprint(project, sprints, sprintIndex + 1, story);
};

export const groupBySprints = (stories = [], project, initialSprintNumber) => {
  return stories.reduce((sprints, story) => {
    const firstSprintIndex = 0;
    const isFromSprintInProgress = !Story.isUnstarted(story);

    sprints = handleSprintsOverflow(
      project,
      sprints,
      Story.getPoints(story),
      initialSprintNumber
    );

    if (sprints.length === 0) {
      createFirstSprint(sprints, project, initialSprintNumber);
    }

    if (isFromSprintInProgress) {
      return addStoryToSprint(project, sprints, firstSprintIndex, story);
    }

    return addToSprintFromBacklog(sprints, project, story);
  }, []);
};
