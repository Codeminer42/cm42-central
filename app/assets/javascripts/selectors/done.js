import moment from "moment";

export const mountPastIterations = (pastIterations) => {
  const sprints = pastIterations.map((sprint, index) => ({
    ...sprint,
    number: index + 1,
    startDate: moment(sprint.startDate).format("ddd MMM Do Y"),
    endDate: moment(sprint.endDate).format("ddd MMM Do Y"),
    stories: [],
  }));

  return sprints;
};
