import PropTypes from 'prop-types';

const projectPropTypesShape = PropTypes.shape({
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

export default projectPropTypesShape;
