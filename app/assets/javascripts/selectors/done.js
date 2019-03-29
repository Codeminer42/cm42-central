import moment from "moment";

export const mountPastIterations = (pastIterations) =>
  pastIterations.map(sprint => ({
    ...sprint,
    number: sprint.iterationNumber,
    startDate: sprint.startDate,
    endDate: sprint.endDate,
    stories: []
  }));
