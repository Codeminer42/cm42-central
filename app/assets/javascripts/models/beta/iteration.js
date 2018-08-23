import moment from "moment";
import { status, storyTypes } from "libs/beta/constants";
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

const createSprint = (sprintNumber = 0, startDate = 0, isFiller = false) => ({
  number: sprintNumber,
  startDate: startDate,
  points: 0,
  completedPoints: null,
  stories: [],
  isFiller: isFiller
});

const createFillerSprints = (size, initialNumber, project) => {
  let fillerSprints = [];
  for (let i = 1; i <= size + 1; i++) {
    const sprintNumber = initialNumber + i;
    const sprint = createSprint(
      sprintNumber,
      getDateForIterationNumber(sprintNumber, project),
      0,
      0,
      true
    );
    fillerSprints.push(sprint);
  }
  return fillerSprints;
};

const canTakeStory = (sprint, storyPoints, velocity) => {
  if (sprint && !sprint.isVoid) {
    return sprint.points + storyPoints <= velocity || sprint.points === 0;
  }
  return false;
};

const calculateOverflow = (storyPoints, velocity) => {
  return Math.ceil((storyPoints - velocity) / velocity);
};

const addStoryToSprint = (project, sprints, index, story) => {
  if (!sprints[index]) {
    const currentSprintNumber = sprints.length + getCurrentIteration(project);
    sprints[index] = createSprint(
      currentSprintNumber,
      getDateForIterationNumber(currentSprintNumber, project)
    );
  }

  sprints[index].stories.push(story);
  sprints[index].points += Story.getPoints(story);
  sprints[index].completedPoints += Story.getCompletedPoints(story);

  return sprints;
};

export const reduceToSprints = (stories = [], project, initialSprintNumber) => {
  return stories.reduce((sprints, story) => {
    const isUnstarted = Story.isUnstarted(story);
    const storyPoints = Story.getPoints(story);
    const sprintIndex = sprints.length > 0 ? sprints.length - 1 : 0;
    const currentSprintNumber = sprints.length + initialSprintNumber;

    if (!isUnstarted) {
      return addStoryToSprint(project, sprints, 0, story);
    }

    const hasSpace = canTakeStory(
      sprints[sprintIndex],
      storyPoints,
      project.defaultVelocity
    );

    if (hasSpace) {
      return addStoryToSprint(project, sprints, sprintIndex, story);
    }

    const newSprints = addStoryToSprint(
      project,
      sprints,
      sprintIndex + 1,
      story
    );
    const overflow = calculateOverflow(storyPoints, project.defaultVelocity);
    const hasOverflown = overflow > 0;

    if (hasOverflown) {
      const fillerSprints = createFillerSprints(
        overflow,
        currentSprintNumber,
        project
      );
      return [...newSprints, ...fillerSprints];
    }

    return [...newSprints];
  }, []);
};
