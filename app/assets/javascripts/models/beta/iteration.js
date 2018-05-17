import moment from 'moment';

const weeksBetween = (dateA, dateB) =>
  moment(new Date(dateA)).diff(moment(new Date(dateB)), 'week');

const getIterationForDate = (date, project) => {
  const weeks = weeksBetween(date, project.startDate);
  const iterationQuantity = Math.ceil(weeks / project.iterationLength);

  return project.iterationLength > weeks ? iterationQuantity : iterationQuantity + 1;
};

export const getCurrentIteration = (project) => (
  getIterationForDate(new Date(), project)
);

export const getIterationForStory = (story, project) => {
  if (story.state === 'accepted') {
    return getIterationForDate(new Date(story.acceptedAt), project);
  }
}
