export const order = sprints => 
  sprints.every(sprint => isDone(sprint)) ? sprints.reverse() : sprints

export const isDone = sprint => sprint.hasOwnProperty('hasStories');
