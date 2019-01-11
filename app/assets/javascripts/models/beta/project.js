import * as Label from './label';

export const deserialize = (board) => ({
  ...board.project,
  projectLabels: Label.splitLabels(board.projectLabels)
});

export const addLabel = (project, label) => (
  {
    ...project,
    projectLabels: [
      ...project.projectLabels,
      label
    ]
  }
);
