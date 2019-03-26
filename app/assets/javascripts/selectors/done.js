import moment from "moment";

export const mountPastIterations = (pastIterations) =>
  pastIterations.map(sprint => ({
    ...sprint,
    number: sprint.iterationNumber,
    startDate: moment(sprint.startDate).format("ddd MMM Do Y"),
    endDate: moment(sprint.endDate).format("ddd MMM Do Y"),
    stories: []
  }));
