import moment from 'moment';

export function getSprint(project) {
  const startDate = moment(new Date(project.startDate));
  const weeks = moment().diff(startDate, 'week');
  const sprintNumber = Math.ceil(weeks / project.iterationLength);
  return project.iterationLength > weeks ? sprintNumber : sprintNumber + 1;
}

export function getIterationForStory(story, project) {
  if(story.state === 'accepted') {
    const weeks = moment().diff(new Date(story.acceptedAt), 'week');
    const sprintNumber = Math.ceil(weeks / project.iterationLength);
    return project.iterationLength > weeks ? sprintNumber : sprintNumber + 1;
  }
}
