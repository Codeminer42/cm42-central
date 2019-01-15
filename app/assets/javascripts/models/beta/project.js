import * as Label from './label';

export const deserialize = (board) => ({
  ...board.project,
  labels: Label.splitLabels(board.labels)
});

export const addLabel = (project, label) => ({
  ...project,
  labels: Label.uniqueLabels([
    ...project.labels,
    label
  ])
});
