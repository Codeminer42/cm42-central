import moment from "moment";

export const mountPastIterations = (pastIterations, stories) =>
  pastIterations.map(sprint => ({
    ...sprint,
    number: sprint.iterationNumber,
    startDate: sprint.startDate,
    endDate: sprint.endDate,
    stories: stories.filter(story => sprint.storyIds.includes(story.id))
  })).reverse();
