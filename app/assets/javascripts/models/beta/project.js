import * as Label from './label';
import { sprintVelocity } from './iteration';

export const deserialize = board => {
  const calculatedSprintVelocity = sprintVelocity(
    board.project,
    board.pastIterations
  );

  return {
    ...board.project,
    calculatedSprintVelocity,
    currentSprintVelocity: calculatedSprintVelocity,
    labels: Label.splitLabels(board.labels),
  };
};

export const addLabel = (project, label) => ({
  ...project,
  labels: Label.uniqueLabels([...project.labels, label]),
});
