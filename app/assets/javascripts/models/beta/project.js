import * as Label from './label';
import PropTypes from 'prop-types';

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

export const projectPropTypesShape = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  startDate: PropTypes.string,
  iterationStartDay: PropTypes.number,
  defaultVelocity: PropTypes.number,
  lastChangesetId: PropTypes.number,
  pointValues: PropTypes.arrayOf(PropTypes.number),
  labels: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  }))
});
